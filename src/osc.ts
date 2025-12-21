import { InstanceBaseExt } from './utils.js'
import { InstanceStatus, OSCSomeArguments } from '@companion-module/base'
import { ZoomConfig } from './config.js'
const osc = require('osc') // eslint-disable-line

interface ZoomOSCResponse {
	address: string
	args: {
		type: string
		value: any
	}[]
}

export class OSC {
	private readonly instance: InstanceBaseExt<ZoomConfig>
	private oscHost = ''
	private oscTxPort = 1234
	private oscRxPort = 0
	private udpPort: any

	constructor(instance: InstanceBaseExt<ZoomConfig>) {
		this.instance = instance
		// Connect to ZoomOSC
		this.Connect()
	}

	/**
	 * @description Close connection on instance disable/removal
	 */
	public readonly destroy = (): void => {
		if (this.udpPort) {
			this.udpPort.close()
			delete this.udpPort
			this.instance.log('info', 'Closed OSC connection to Zoom Tiles')
		}
	}

	/**
	 * @description Create a OSC connection to Zoom
	 */
	public readonly Connect = (): void => {
		this.instance.log('debug', 'Connecting to Zoom Tiles...')
		this.instance.log('info', `Configuring Zoom Tiles connection to ${JSON.stringify(this.instance.config)}`)
		this.oscHost = this.instance.config.host || '127.0.0.1'
		this.oscTxPort = this.instance.config.rx_port || 3456
		this.oscRxPort = 0 // No receive port currently used by Zoom Tiles

		this.instance.updateStatus(InstanceStatus.Connecting)
		this.udpPort = new osc.UDPPort({
			localAddress: this.oscHost,
			// There is currently no transmit port to get feedback from Zoom Tiles
			// localPort: this.oscRxPort,
			metadata: true,
		})

		// Listen for incoming OSC messages.
		// Currently Not Used by Zoom Tiles but here for future use
		this.udpPort.on('message', (oscMsg: ZoomOSCResponse) => {
			this.processData(oscMsg)
		})

		this.udpPort.on('error', (err: { code: string; message: string }) => {
			this.instance.log('error', `UDP port error: ${err.message}.  Code: ${err.code}`)
			if (err.code === 'EADDRINUSE') {
				this.instance.log('error', 'Error: Selected port in use.' + err.message)
				this.instance.updateStatus(InstanceStatus.BadConfig, 'Port in use')
			}
		})

		// When the port is ready
		this.udpPort.on('ready', () => {
			this.instance.log('info', `Listening to Zoom Tiles on port: ${this.oscRxPort}`)
			this.instance.updateStatus(InstanceStatus.Connecting, 'Listening for first response')
		})

		// Open the socket.
		// this.instance.log('debug', `Opening UDP port on ${this.oscTxPort}`)
		this.udpPort.open()
	}

	private processData = (data: ZoomOSCResponse) => {
		// this.instance.log('debug', '+++++++++++receiving:' + JSON.stringify(data))
		// Do a switch block to go fast through the rest of the data
		try {
			this.instance.log('debug', `Processing OSC message: ${JSON.stringify(data)}`)
		} catch (error) {
			this.instance.log('error', `unable to process data for ${JSON.stringify(data)}. Error: ${JSON.stringify(error)}`)
		}
	}

	/**
	 * @param command function and any params
	 * @description Check OSC connection status and format command to send to Zoom
	 */
	public readonly sendCommand = (path: string, args?: OSCSomeArguments): void => {
		this.instance.log('debug', `sending ${JSON.stringify(path)} ${args ? JSON.stringify(args) : ''}`)
		try {
			this.udpPort.send(
				{
					address: path,
					args: args ? args : [],
				},
				this.oscHost,
				this.oscTxPort,
			)
		} catch (error) {
			this.instance.log(
				'error',
				`sendCommand error for path: ${path} and args: ${JSON.stringify(args)}. Error: ${JSON.stringify(error)}`,
			)
		}
	}
}
