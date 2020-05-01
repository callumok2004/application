module.exports = {
    packagerConfig: {
      icon: "assets/favicon.ico",
      name: "RiseFM",
      win32metadata: {
        CompanyName: "RiseFM",
        ProductName: "RiseFM"
      }
    },
    publishers: [
      {
        name: '@electron-forge/publisher-github',
        config: {
          repository: {
            owner: 'RiseFM',
            name: 'application'
          },
          prerelease: true,
          authToken: '731a8da3fa345d1cfa2e1e871d77e2624f45066e'
        }
      }
    ],
    makers: [
        {
          name: "@electron-forge/maker-squirrel",
          config: {
            name: "RiseFM",
            setupExe: "RiseFM Setup.exe",
            exe: "RiseFM.exe",
            iconUrl: "https://livida.net/assets/favicon.ico",
            setupIcon: "assets/favicon.ico"
          }
        },
        {
          name: "@electron-forge/maker-zip",
          platforms: [
            "darwin"
          ]
        },
        {
          name: "@electron-forge/maker-deb",
          config: {}
        },
        {
          name: "@electron-forge/maker-rpm",
          config: {}
        }
      ]
    }
