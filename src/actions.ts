import type { ZoomInstance } from './main.js'
import { options } from './utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

export function UpdateActions(self: ZoomInstance): void {
	self.setActionDefinitions({
		startPMI: {
			name: 'Start Personal Meeting ID',
			options: [],
			callback: (): void => {
				self.log('debug', `Action Start Personal Meeting ID triggered`)
				const command = createCommand('/startPMI')

				const sendToCommand = {
					id: 'startPMI',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(self, sendToCommand)
			},
		},
		startIM: {
			name: 'Start Instant Meeting',
			options: [],
			callback: (): void => {
				self.log('debug', `Action Start Instant Meeting triggered`)
				const command = createCommand('/startIM')

				const sendToCommand = {
					id: 'startIM',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(self, sendToCommand)
			},
		},
		joinMeeting: {
			name: 'Join Meeting',
			options: [options.meetingID, options.password, options.name],
			callback: async (action): Promise<void> => {
				self.log('debug', `Action Join Meeting triggered: ${JSON.stringify(action)}`)
				const command = createCommand('/joinMeeting')
				const name = await self.parseVariablesInString(action.options.name as string)
				const meetingID = await self.parseVariablesInString(action.options.meetingID as string)
				const password = await self.parseVariablesInString(action.options.password as string)

				command.args.push({ type: 's', value: meetingID })
				command.args.push({ type: 's', value: password })
				command.args.push({ type: 's', value: name })

				const sendToCommand = {
					id: 'joinMeeting',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(self, sendToCommand)
			},
		},
		zakJoin: {
			name: 'ZAK Join Meeting',
			options: [options.zak, options.meetingID, options.password, options.name],
			callback: async (action): Promise<void> => {
				// type: 'Special'
				const command = createCommand('/zakJoin')
				const name = await self.parseVariablesInString(action.options.name as string)
				const zak = await self.parseVariablesInString(action.options.zak as string)
				const meetingId = await self.parseVariablesInString(action.options.meetingID as string)
				const password = await self.parseVariablesInString(action.options.password as string)
				command.args.push({ type: 's', value: zak })
				command.args.push({ type: 'i', value: meetingId })
				command.args.push({ type: 's', value: name })
				command.args.push({ type: 's', value: password })
				const sendToCommand = {
					id: 'zakJoin',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(self, sendToCommand)
			},
		},
		leaveMeeting: {
			name: 'Leave Meeting',
			options: [],
			callback: (): void => {
				self.log('debug', `Action Leave Meeting triggered`)
				const command = createCommand('/leaveMeeting')

				const sendToCommand = {
					id: 'leaveMeeting',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(self, sendToCommand)
			},
		},
		startCaptureEngine: {
			name: 'Start Capture Engine',
			options: [],
			callback: (): void => {
				self.log('debug', `Action Start Capture Engine triggered`)
				const command = createCommand('/startCaptureEngine')

				const sendToCommand = {
					id: 'startCaptureEngine',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(self, sendToCommand)
			},
		},
		stopCaptureEngine: {
			name: 'Stop Capture Engine',
			options: [],
			callback: (): void => {
				self.log('debug', `Action Stop Capture Engine triggered`)
				const command = createCommand('/stopCaptureEngine')

				const sendToCommand = {
					id: 'stopCaptureEngine',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(self, sendToCommand)
			},
		},
		enableGallery: {
			name: 'Enable Gallery',
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
				self.log('debug', `Action Enable Gallery triggered`)
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

				sendActionCommand(self, sendToCommand)
			},
		},
		disableGallery: {
			name: 'Disable Gallery',
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
				self.log('debug', `Action Disable Gallery triggered`)
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

				sendActionCommand(self, sendToCommand)
			},
		},
		startQueueTimer: {
			name: 'Start Queue Timer',
			options: [],
			callback: (): void => {
				self.log('debug', `Action Start Queue Timer triggered`)
				const command = createCommand('/startQueueTimer')
				const sendToCommand = {
					id: 'startQueueTimer',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(self, sendToCommand)
			},
		},
		stopQueueTimer: {
			name: 'Stop Queue Timer',
			options: [],
			callback: (): void => {
				self.log('debug', `Action Stop Queue Timer triggered`)
				const command = createCommand('/stopQueueTimer')
				const sendToCommand = {
					id: 'stopQueueTimer',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(self, sendToCommand)
			},
		},
		activateHolePunch: {
			name: 'Activate Hole Punch',
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
				self.log('debug', `Action Activate Hole Punch triggered`)
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

				sendActionCommand(self, sendToCommand)
			},
		},
		deactivateHolePunch: {
			name: 'Deactivate Hole Punch',
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
				self.log('debug', `Action Deactivate Hole Punch triggered`)
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

				sendActionCommand(self, sendToCommand)
			},
		},
	})
}
