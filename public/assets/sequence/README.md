# 📸 Image Sequence Directory

## Instructions

Place your 170 JPEG frames here with the following naming convention:

```
frame_000.jpg
frame_001.jpg
frame_002.jpg
...
frame_169.jpg
```

## Requirements

- **Format**: JPEG (.jpg)
- **Total Frames**: 170
- **Naming**: Zero-padded 3-digit numbering
- **Dimensions**: 1920x1080 (recommended)

## Example

If you have frames numbered 0-169, rename them to:
- `0.jpg` → `frame_000.jpg`
- `1.jpg` → `frame_001.jpg`
- `50.jpg` → `frame_050.jpg`
- `169.jpg` → `frame_169.jpg`

## Batch Rename (Windows PowerShell)

If your files are named differently, use this script:

```powershell
$i = 0
Get-ChildItem -Filter *.jpg | ForEach-Object {
    $newName = "frame_{0:D3}.jpg" -f $i
    Rename-Item $_.FullName $newName
    $i++
}
```

---

**Once you've added all 170 frames, run `npm run dev` to see the animation!**
