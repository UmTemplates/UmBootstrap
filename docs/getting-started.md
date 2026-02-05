# Getting Started

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download) or later
- A code editor (Visual Studio, VS Code, Rider)

## Installation

### Option 1: .NET CLI (Recommended)

```bash
# Install the template
dotnet new install UmBootstrap.DotNet.Template

# Create a new project
dotnet new umbootstrap -n MyProject

# Navigate to the project
cd MyProject

# Run the site
dotnet run
```

### Option 2: Visual Studio

1. Install the template: `dotnet new install UmBootstrap.DotNet.Template`
2. Open Visual Studio
3. Create New Project
4. Search for "UmBootstrap"
5. Follow the wizard

## First Run

On first run, Umbraco will:

1. Create the database (SQLite by default)
2. Import content via uSync
3. Launch the backoffice setup wizard

### Default Setup

- **Database**: SQLite (stored in `umbraco/Data/`)
- **Admin credentials**: Set during first run
- **Content**: Sample pages imported via uSync

## Project Structure

```
MyProject/
├── Views/
│   ├── Partials/
│   │   ├── blockgrid/     # Block grid component views
│   │   └── blocklist/     # Block list component views
│   ├── Home.cshtml        # Home page template
│   └── WebPage.cshtml     # Generic page template
├── umbraco/
│   ├── Models/            # Generated C# models
│   └── Data/              # Database files
├── uSync/v17/             # Content/config sync files
├── wwwroot/               # Static assets (CSS, JS, images)
└── appsettings.json       # Configuration
```

## Configuration

### BlockPreview

Block previews are configured in `appsettings.json`:

```json
{
  "BlockPreview": {
    "BlockGrid": {
      "Enabled": true,
      "ContentTypes": ["featureRichTextEditor", "featureImage"],
      "Stylesheets": ["/css/Index.css"]
    }
  }
}
```

Add your feature element types to `ContentTypes` to enable live previews in the backoffice.

### uSync

uSync automatically imports content on first boot:

```json
{
  "uSync": {
    "Settings": {
      "ImportOnFirstBoot": true
    }
  }
}
```

## Next Steps

- Explore the backoffice at `/umbraco`
- Edit the sample content
- Create new document types
- Customise the Bootstrap theme in `SCSS/`
