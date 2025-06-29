# Complete Keyboard-Only Coding Guide

## Table of Contents
- [VSCode Essential Shortcuts](#vscode-essential-shortcuts)
- [Navigation](#navigation)
- [Window & Tab Management](#window--tab-management)
- [Code Editing](#code-editing)
- [Multi-cursor & Selection](#multi-cursor--selection)
- [Search & Replace](#search--replace)
- [Terminal](#terminal)
- [Vim Extension Shortcuts](#vim-extension-shortcuts)
- [Go-Specific Shortcuts](#go-specific-shortcuts)
- [Browser (Vimium) Shortcuts](#browser-vimium-shortcuts)
- [Advanced Workflows](#advanced-workflows)
- [Learning Plan](#learning-plan)
- [Setup & Configuration](#setup--configuration)

---

## VSCode Essential Shortcuts

### Core Navigation
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + P` | Quick File Finder | Open any file by typing its name |
| `Ctrl + Shift + P` | Command Palette | Access any VSCode command |
| `Ctrl + E` | Recent Files | Switch between recently opened files |
| `Ctrl + Shift + E` | Toggle Explorer | Show/hide file explorer panel |
| `Ctrl + Shift + .` | Focus Breadcrumbs | Navigate file structure via breadcrumbs |
| `Ctrl + G` | Go to Line | Jump to specific line number |
| `Ctrl + 0` | Focus Explorer | Focus on file explorer |
| `Ctrl + 1, 2, 3...` | Focus Editor Groups | Switch between editor panes |

### Navigation Within Files
| Shortcut | Action | Description |
|----------|--------|-------------|
| `F12` | Go to Definition | Jump to function/variable definition |
| `Shift + F12` | Find All References | Show all usages of symbol |
| `Alt + ←` | Navigate Back | Go to previous cursor position |
| `Alt + →` | Navigate Forward | Go to next cursor position |
| `Ctrl + M` | Toggle Tab Focus | Navigate with Tab key |
| `Home` | Line Start | Move cursor to beginning of line |
| `End` | Line End | Move cursor to end of line |
| `Ctrl + Home` | File Start | Jump to beginning of file |
| `Ctrl + End` | File End | Jump to end of file |

---

## Window & Tab Management

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + Tab` | Next Tab | Switch to next open tab |
| `Ctrl + Shift + Tab` | Previous Tab | Switch to previous tab |
| `Ctrl + W` | Close Tab | Close current tab |
| `Ctrl + K, Ctrl + W` | Close All Tabs | Close all open tabs |
| `Ctrl + \` | Split Editor | Split editor vertically |
| `Ctrl + K, Ctrl + \` | Split Horizontal | Split editor horizontally |
| `Ctrl + PageUp` | Previous Tab Group | Switch to previous tab |
| `Ctrl + PageDown` | Next Tab Group | Switch to next tab |
| `Ctrl + K, ←/→/↑/↓` | Focus Split | Move between editor splits |

---

## Code Editing

### Basic Editing
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + L` | Select Line | Select entire current line |
| `Ctrl + X` | Cut Line | Cut current line (if nothing selected) |
| `Ctrl + C` | Copy Line | Copy current line (if nothing selected) |
| `Ctrl + V` | Paste | Paste from clipboard |
| `Ctrl + Z` | Undo | Undo last action |
| `Ctrl + Y` | Redo | Redo last undone action |
| `Ctrl + Enter` | New Line Below | Insert new line below cursor |
| `Ctrl + Shift + Enter` | New Line Above | Insert new line above cursor |
| `Alt + ↑/↓` | Move Line | Move current line up/down |
| `Shift + Alt + ↑/↓` | Copy Line | Duplicate line up/down |

### Advanced Editing
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + /` | Toggle Comment | Comment/uncomment line |
| `Shift + Alt + A` | Block Comment | Toggle block comment |
| `Ctrl + ]` | Indent Line | Increase indentation |
| `Ctrl + [` | Outdent Line | Decrease indentation |
| `Ctrl + K, Ctrl + F` | Format Selection | Format selected code |
| `Shift + Alt + F` | Format Document | Format entire document |
| `F2` | Rename Symbol | Rename variable/function |
| `Ctrl + .` | Quick Fix | Show code actions/fixes |

---

## Multi-cursor & Selection

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + D` | Select Word | Select current word (repeat for more) |
| `Ctrl + K, Ctrl + D` | Skip Selection | Skip current selection, select next |
| `Ctrl + U` | Undo Selection | Undo last cursor/selection |
| `Ctrl + Alt + ↑/↓` | Add Cursor | Add cursor above/below |
| `Alt + Shift + I` | Cursors at Line Ends | Add cursors to end of selected lines |
| `Ctrl + Shift + L` | Select All Occurrences | Select all occurrences of current word |
| `Alt + Click` | Add Cursor | Add cursor at click position |
| `Shift + Alt + →` | Expand Selection | Expand selection |
| `Shift + Alt + ←` | Shrink Selection | Shrink selection |

---

## Search & Replace

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + F` | Find | Find in current file |
| `Ctrl + H` | Replace | Find and replace in current file |
| `Ctrl + Shift + F` | Find in Files | Search across all files |
| `Ctrl + Shift + H` | Replace in Files | Replace across all files |
| `F3` | Find Next | Go to next search result |
| `Shift + F3` | Find Previous | Go to previous search result |
| `Alt + Enter` | Select All Matches | Select all find matches |
| `Ctrl + K, Ctrl + D` | Add to Selection | Add next find match to selection |

---

## Terminal

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + `` | Toggle Terminal | Show/hide integrated terminal |
| `Ctrl + Shift + `` | New Terminal | Create new terminal instance |
| `Ctrl + Shift + 5` | Split Terminal | Split terminal horizontally |
| `Alt + ←/→` | Switch Terminal | Switch between terminal tabs |
| `Ctrl + Shift + C` | Copy | Copy selected text in terminal |
| `Ctrl + Shift + V` | Paste | Paste into terminal |
| `Ctrl + ↑/↓` | Scroll | Scroll terminal up/down |
| `Ctrl + Shift + K` | Clear Terminal | Clear terminal output |

---

## Vim Extension Shortcuts

### Basic Movement (Normal Mode)
| Key | Action | Description |
|-----|--------|-------------|
| `h, j, k, l` | Move Cursor | Left, down, up, right |
| `w` | Next Word | Move to beginning of next word |
| `b` | Previous Word | Move to beginning of previous word |
| `e` | End of Word | Move to end of current word |
| `0` | Line Start | Move to beginning of line |
| `$` | Line End | Move to end of line |
| `gg` | File Start | Go to beginning of file |
| `G` | File End | Go to end of file |
| `{` | Previous Paragraph | Move to previous blank line |
| `}` | Next Paragraph | Move to next blank line |

### Modes
| Key | Mode | Description |
|-----|------|-------------|
| `i` | Insert | Insert text before cursor |
| `a` | Append | Insert text after cursor |
| `o` | Open Below | Create new line below and enter insert |
| `O` | Open Above | Create new line above and enter insert |
| `v` | Visual | Visual selection mode |
| `V` | Visual Line | Visual line selection mode |
| `Ctrl + v` | Visual Block | Visual block selection mode |
| `Esc` | Normal | Return to normal mode |

### Text Objects & Operations
| Key | Action | Description |
|-----|--------|-------------|
| `d` | Delete | Delete motion (dw = delete word) |
| `c` | Change | Change motion (cw = change word) |
| `y` | Yank | Copy motion (yw = copy word) |
| `p` | Paste | Paste after cursor |
| `P` | Paste Before | Paste before cursor |
| `u` | Undo | Undo last action |
| `Ctrl + r` | Redo | Redo last undone action |
| `.` | Repeat | Repeat last command |

### Advanced Text Objects
| Key | Action | Description |
|-----|--------|-------------|
| `ciw` | Change Inner Word | Change word under cursor |
| `ci"` | Change Inside Quotes | Change text