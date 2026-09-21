"""Synthetic packaging checks only; no Agent, network or project runtime."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location(
    "lab_check", Path(__file__).resolve().parents[1] / "scripts/check.py")
CHECK = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(CHECK)

class PackageChecks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="Agent-Art-Lab-check-")
        self.root = Path(self.temp.name)
        self.addCleanup(self.temp.cleanup)

    def put(self, name, content):
        target = self.root / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
        return target

    def errors(self):
        return CHECK.check_tree(self.root, require_layout=False)[0]

    def test_portable_links_and_exact_integer_json(self):
        self.put("README.md", "# Example\n\n[record](record.json)\n")
        self.put("record.json", '{"integer":9007199254740993}\n')
        self.assertEqual(self.errors(), [])

    def test_missing_link(self):
        self.put("README.md", "[missing](missing.md)\n")
        self.assertTrue(any("missing local" in e for e in self.errors()))

    def test_escape(self):
        self.put("README.md", "[outside](../outside.md)\n")
        self.assertTrue(any("out-of-repository" in e for e in self.errors()))

    def test_private_path(self):
        self.put("README.md", "/Users/example/private-file\n")
        self.assertTrue(any("personal path" in e for e in self.errors()))

    def test_duplicate_json(self):
        self.put("record.json", '{"key":1,"key":2}\n')
        self.assertTrue(any("invalid strict JSON" in e for e in self.errors()))

    def test_nonfinite_json(self):
        self.put("record.json", '{"key":NaN}\n')
        self.assertTrue(any("invalid strict JSON" in e for e in self.errors()))

    def test_symlink(self):
        self.put("target.md", "# Target\n")
        (self.root / "link.md").symlink_to("target.md")
        self.assertTrue(any("symlink file" in e for e in self.errors()))

    def test_credential_value(self):
        self.put("README.md", "Bearer " + "A" * 24 + "\n")
        self.assertTrue(any("credential-like" in e for e in self.errors()))

    def test_required_layout(self):
        self.assertTrue(CHECK.check_tree(self.root)[0])

    def test_credential_filename(self):
        self.put(".env", "SYNTHETIC=example\n")
        self.assertTrue(any("credential-file" in e for e in self.errors()))

if __name__ == "__main__":
    unittest.main()
