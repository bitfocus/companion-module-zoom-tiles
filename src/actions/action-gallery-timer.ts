import { CompanionActionDefinition } from '@companion-module/base'
import { createCommand, sendActionCommand } from './action-utilities/action-utils.js'
import { InstanceBaseExt } from '../utils.js'
import { ZoomConfig } from '../config.js'

export enum ActionIdGalleryTimer {
	startQueueTimer = 'startQueueTimer',
	stopQueueTimer = 'stopQueueTimer',
	enableGallery = 'enableGallery',
	disableGallery = 'disableGallery',
	activateHolePunch = 'activateHolePunch',
	deactivateHolePunch = 'deactivateHolePunch',
}

/**
 * @help-description
 * Gallery Timer actions control gallery view rotation and visibility.
 * Use queue timers to automatically cycle through participants, enable/disable specific galleries, and activate hole punch for transparency effects.
 */
export function GetActionsGalleryTimer(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdGalleryTimer]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdGalleryTimer]: CompanionActionDefinition | undefined } = {
		[ActionIdGalleryTimer.enableGallery]: {
			name: 'Enable Gallery',
			description: 'Enable a specific gallery view.',
			options: [
				{
					type: 'number',
					label: 'Gallery #',
					id: 'galleryIndex',
					min: 0,
					max: 10,
					default: 1,
				},
			],
			callback: (action): void => {
				const command = createCommand('/enableGallery')

				command.args.push({
					type: 'i',
					value: action.options.galleryIndex as number,
				})
				const sendToCommand = {
					id: 'enableGallery',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGalleryTimer.disableGallery]: {
			name: 'Disable Gallery',
			description: 'Disable a specific gallery view.',
			options: [
				{
					type: 'number',
					label: 'Gallery #',
					id: 'galleryIndex',
					min: 0,
					max: 10,
					default: 1,
				},
			],
			callback: (action): void => {
				const command = createCommand('/disableGallery')

				command.args.push({
					type: 'i',
					value: action.options.galleryIndex as number,
				})
				const sendToCommand = {
					id: 'disableGallery',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGalleryTimer.startQueueTimer]: {
			name: 'Start Queue Timer',
			description: 'Start the queue timer for gallery updates.',
			options: [],
			callback: (): void => {
				const command = createCommand('/startQueueTimer')
				const sendToCommand = {
					id: 'startQueueTimer',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGalleryTimer.stopQueueTimer]: {
			name: 'Stop Queue Timer',
			description: 'Stop the queue timer for gallery updates.',
			options: [],
			callback: (): void => {
				const command = createCommand('/stopQueueTimer')
				const sendToCommand = {
					id: 'stopQueueTimer',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGalleryTimer.activateHolePunch]: {
			name: 'Activate Hole Punch',
			description: 'Activate hole punch for a specific gallery view.',
			options: [
				{
					type: 'number',
					label: 'Gallery #',
					id: 'galleryIndex',
					min: 0,
					max: 10,
					default: 1,
				},
			],
			callback: (action): void => {
				const command = createCommand('/activateHolePunch')

				command.args.push({
					type: 'i',
					value: action.options.galleryIndex as number,
				})
				const sendToCommand = {
					id: 'activateHolePunch',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGalleryTimer.deactivateHolePunch]: {
			name: 'Deactivate Hole Punch',
			description: 'Deactivate Hole Punch for a specific gallery view.',
			options: [
				{
					type: 'number',
					label: 'Gallery #',
					id: 'galleryIndex',
					min: 0,
					max: 10,
					default: 1,
				},
			],
			callback: (action): void => {
				const command = createCommand('/deactivateHolePunch')

				command.args.push({
					type: 'i',
					value: action.options.galleryIndex as number,
				})
				const sendToCommand = {
					id: 'deactivateHolePunch',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
	}

	return actions
}
