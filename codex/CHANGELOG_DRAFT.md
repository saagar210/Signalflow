# Changelog Draft

## Theme: Validation maintainability
- Added declarative `required` metadata support to node config schema (`ConfigFieldSchema.required`).
- Annotated critical node config fields (template/path/url/pattern/condition/expression/code) as required in the node registry.
- Replaced hard-coded empty-field checks in flow validation with schema-driven required-field checks.

## Theme: Validation coverage
- Expanded `flowValidator` tests to cover:
  - whitespace-only required expression values,
  - missing/empty required code values.
- Test count increased from 21 to 23 total frontend tests.

## User-visible impact
- Pre-run validation now warns more consistently when required expression/code fields are left empty.
