# .claude Directory

This directory contains configuration files for **Claude Code** AI-assisted development.

## 📁 Directory Structure

```
.claude/
├── README.md              # This file
├── USAGE.md              # Complete usage guide
├── QUICK-REFERENCE.md    # Quick command reference
├── commands/             # Code generation commands (10)
│   ├── api.md
│   ├── component.md
│   ├── composable.md
│   ├── enum.md
│   ├── mock.md
│   ├── permission.md
│   ├── role-layout.md
│   ├── route.md
│   ├── store.md
│   └── test.md
└── skills/               # Deep knowledge base (9)
    ├── component-architecture.md
    ├── mock-service.md
    ├── performance.md
    ├── routing-permissions.md
    ├── state-management.md
    ├── styling.md
    ├── testing.md
    ├── typescript-patterns.md
    └── vue-development.md
```

## 🚀 Quick Start

### Using Commands

Commands are quick code generators. Use them with the `/` prefix:

```bash
# Create Pinia Store
/store notification --persist

# Create Mock data
/mock system user

# Add route
/route resource --icon=resource

# Create API
/api system user

# Create component
/component UserCard
```

[View all commands →](./USAGE.md#commands-使用)

### Using Skills

Skills are automatically activated based on context. Ask questions to trigger them:

```bash
"How to create a Pinia Store?"         # → Activates state-management.md
"How to configure route permissions?"   # → Activates routing-permissions.md
"How to optimize performance?"          # → Activates performance.md
```

[View all skills →](./USAGE.md#skills-使用)

## 📖 Documentation

- **[USAGE.md](./USAGE.md)** - Complete usage guide with examples
- **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** - Quick command cheat sheet

## 🎯 What's Included

### Commands (10)

| Command | Purpose |
|---------|---------|
| `/store` | Create Pinia Store module |
| `/mock` | Create MSW mock data |
| `/route` | Add route configuration |
| `/composable` | Create Vue composable |
| `/component` | Create Vue component |
| `/api` | Create API interface |
| `/test` | Create test file |
| `/permission` | Configure permissions |
| `/enum` | Create enum/constants |
| `/role-layout` | Add role layout |

### Skills (9)

| Skill | Topic |
|-------|-------|
| `state-management.md` | Pinia store patterns |
| `routing-permissions.md` | Router & auth |
| `mock-service.md` | MSW configuration |
| `vue-development.md` | Vue 3 patterns |
| `typescript-patterns.md` | TypeScript best practices |
| `component-architecture.md` | Component design |
| `styling.md` | CSS & UnoCSS |
| `testing.md` | Vitest & testing |
| `performance.md` | Optimization strategies |

## 💡 Tips

1. **Start with Commands** - Use commands for repetitive tasks
2. **Learn with Skills** - Skills provide deep knowledge when needed
3. **Combine Both** - Use commands to generate, skills to understand
4. **Ask Questions** - Claude will automatically use the right skill

## 🔗 Related Files

- [Project Documentation](../CLAUDE.md)
- [Main README](../README.md)

## 📝 Contributing

To add new commands or skills:

1. Create `.md` file in `commands/` or `skills/`
2. Follow existing file format
3. Test with Claude Code
4. Submit PR

## 📞 Support

- [Claude Code Docs](https://docs.claude.com/claude-code)
- [Project Issues](https://github.com/your-repo/issues)

---

**Last Updated**: 2024-11-25
