# .NET 10 Upgrade Plan

## Execution Steps

Execute steps below sequentially one by one in the order they are listed.

1. Validate that an .NET 10.0 SDK required for this upgrade is installed on the machine and if not, help to get it installed.
2. Ensure that the SDK version specified in global.json files is compatible with the .NET 10.0 upgrade.
3. Upgrade template-pack.csproj
4. Upgrade Umbootstrap.Web\Umbootstrap.Web.csproj


## Settings

This section contains settings and data used by execution steps.

### Excluded projects

Table below contains projects that do belong to the dependency graph for selected projects and should not be included in the upgrade.

| Project name                                   | Description                 |
|:-----------------------------------------------|:---------------------------:|


### Aggregate NuGet packages modifications across all projects

No NuGet package updates or security vulnerabilities were identified by analysis for the selected projects.


### Project upgrade details

This section contains details about each project upgrade and modifications that need to be done in the project.

#### template-pack.csproj modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - No package changes identified by analysis.

Other changes:
  - Ensure source generators and any SDK-dependent targets are compatible with `net10.0` if present.


#### Umbootstrap.Web\Umbootstrap.Web.csproj modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - No package changes identified by analysis.

Other changes:
  - Review Razor/Umbraco-related dependencies for compatibility with .NET 10 and Umbraco 17 changes.
  - Fix any build or API breakages discovered after changing target framework.


