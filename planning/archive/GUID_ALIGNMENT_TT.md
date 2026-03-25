# GUID Alignment: UmBootstrap → Tailored Travel

## Context
UmBootstrap's data types were recreated to fix a GUID clash. TT still has the old temporary GUIDs from the earlier workaround. We need to align them now while TT has no content, so future syncs don't cause conflicts.

## Current State

### Data types that differ between UmBootstrap and TT:

| Data Type | UmBootstrap GUID | TT GUID | Status |
|---|---|---|---|
| Feature Component - Image - Media Picker | `1ae9aec1-e798-44a8-b180-260a01eb2307` | `2d3daae7-24c5-45ba-badb-d79a074a16dd` | Different — needs aligning |
| Image Media Picker | `46795d19-2f28-42ab-b0f9-4f4e53d842a2` | Check TT | May differ |
| Image Cropper - Responsive | Check both | Check both | Probably same |

### Properties that reference these data types:
- Feature Component - Image → `featurePropertyFeatureImage` → Feature Component - Image - Media Picker
- Site Settings → `logo` → Image Media Picker (or Site Settings - Logo - Media Picker)
- Page Properties → `pageThumbnail` → Feature Component - Image - Media Picker

## Risk Assessment
- **LOW RISK**: TT has no content using these properties yet (tour pages have placeholder content only)
- **MEDIUM RISK**: If uSync import clashes, it could create duplicate data types
- **MITIGATION**: Create feature branch, test, can revert if needed

## Approach
**DO NOT delete any data types.** Instead:

1. Copy the uSync config files from UmBootstrap to TT (overwriting TT's versions)
2. The new files will have UmBootstrap's GUIDs
3. uSync import will either update the existing types or create new ones
4. If it creates duplicates, we remove the old ones manually
5. Reassign properties if needed

## Steps

### Pre-work
- [ ] Create feature branch in TT: `feature/guid-alignment`
- [ ] Do a uSync Settings export in TT (baseline snapshot)
- [ ] Commit baseline

### Step 1: Identify all files that need updating
- [ ] Compare all DataType configs between UmBootstrap and TT
- [ ] Compare all ContentType configs that reference data types
- [ ] List exactly which files to copy

### Step 2: Copy uSync configs (data types only first)
- [ ] Copy updated DataType configs from UmBootstrap to TT
- [ ] Do NOT copy ContentType or MediaType configs yet

### Step 3: Import and test
- [ ] Restart TT
- [ ] Import Settings via uSync
- [ ] Check: do the data types have the correct GUIDs?
- [ ] Check: are there duplicate data types?
- [ ] Check: do properties still point to the right data type?

### Step 4: Fix any issues
- [ ] If duplicates exist, remove the old ones (carefully!)
- [ ] If properties are orphaned, reassign them

### Step 5: Copy remaining configs if needed
- [ ] ContentType configs that reference data type GUIDs
- [ ] MediaType configs if any differ

### Step 6: Full test
- [ ] Upload an Image - Responsive in media library
- [ ] Pick it on an Image feature block
- [ ] Check Logo still works
- [ ] Check Page Thumbnail still works
- [ ] Commit and merge

## Rules
- NEVER delete a data type before creating its replacement
- Always create new first, migrate, then remove old
- Commit after each successful step
- If anything breaks, revert the branch
