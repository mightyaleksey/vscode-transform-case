'use strict'

const camelcase = require('lodash.camelcase')
const snakecase = require('lodash.snakecase')
const vscode = require('vscode')

function createTransformCommand (transform) {
  return () => {
    const textEditor = vscode.window.activeTextEditor
    if (textEditor == null) return

    const selections = textEditor.selections.filter(selection => !selection.isEmpty)
    const replacements = selections.map(selection => transform(textEditor.document.getText(selection)))

    if (replacements.length > 0) {
      textEditor.edit(editBuilder =>
        selections.forEach((s, i) => editBuilder.replace(s, replacements[i])))
    }
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
  const camelcaseSubscription = vscode.commands.registerCommand('vscode-transform-case.camelcase',
    createTransformCommand(camelcase))

  const snakecaseSubscription = vscode.commands.registerCommand('vscode-transform-case.snakecase',
    createTransformCommand(snakecase))

  context.subscriptions.push(camelcaseSubscription)
  context.subscriptions.push(snakecaseSubscription)
}

function deactivate () {}

module.exports = {
  activate,
  deactivate
}
