const defaultPlugins = [
  'slate',
  'image',
  'divider',
  'spacer',
  'spoiler',
  'geogebra',
  'license',
  'injection',
  'table'
]

const exercisePlugins = ['scMcExercise', 'textfield', 'solution', 'hint']

export default pluginMapping => editableType => {
  const plugins = choosePlugins(editableType)
  return plugins.map( plugin => pluginMapping[plugin])
}

const choosePlugins = type => {
  if (type === 'text-exercise' || type === 'grouped-text-exercise') {
    return [...defaultPlugins, ...exercisePlugins]
  }

  return defaultPlugins
}