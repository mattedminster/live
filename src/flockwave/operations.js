/**
 * Functions for handling common operations on the Flockwave server using
 * promises.
 */

import { extractResponseForId } from './parsing';
import { validateExtensionName } from './validation';

/**
 * Asks the server to set a new configuration object for the extension with the
 * given name.
 */
export async function configureExtension(hub, name, configuration) {
  validateExtensionName(name);

  const response = await hub.sendMessage({
    type: 'EXT-SETCFG',
    ids: { [name]: configuration }
  });

  const status = extractResponseForId(response, name, {
    error: `Failed to retrieve configuration for extension: ${name}`
  });

  return Boolean(status);
}

/**
 * Asks the server to reload the extension with the given name.
 */
export async function reloadExtension(hub, name) {
  validateExtensionName(name);

  const response = await hub.sendMessage({
    type: 'EXT-RELOAD',
    ids: [name]
  });

  const status = extractResponseForId(response, name, {
    error: `Failed to reload extension: ${name}`
  });

  return Boolean(status);
}

/**
 * Query handler object that can be used to perform common operations on a
 * Flockwave server using a given message hub.
 */
export class OperationExecutor {
  _operations = {
    configureExtension,
    reloadExtension
  };

  /**
   * Constructor.
   *
   * @param {MessageHub} hub  the message hub to use for communication
   */
  constructor(hub) {
    for (const [name, func] of Object.entries(this._operations)) {
      this[name] = (...args) => func(hub, ...args);
    }
  }
}