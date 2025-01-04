

function Versions(): JSX.Element {
  const versions = ''

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{versions}</li>
      <li className="chrome-version">Chromium v{versions}</li>
      <li className="node-version">Node v{versions}</li>
    </ul>
  )
}

export default Versions
