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
	private oscTXPort = 1234
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
		if (this.udpPort) this.udpPort.close()
		return
	}

	/**
	 * @description Create a OSC connection to Zoom
	 */
	public readonly Connect = (): void => {
		this.oscHost = this.instance.config.host || '127.0.0.1'
		this.oscTXPort = this.instance.config.rx_port || 3456

		this.instance.updateStatus(InstanceStatus.Connecting)
		this.udpPort = new osc.UDPPort({
			localAddress: '0.0.0.0',
			localPort: this.oscTXPort,
			metadata: true,
		})

		// Listen for incoming OSC messages.
		this.udpPort.on('message', (oscMsg: ZoomOSCResponse) => {
			// this.instance.log('info', JSON.stringify(oscMsg))

			this.processData(oscMsg)
		})

		this.udpPort.on('error', (err: { code: string; message: string }) => {
			if (err.code === 'EADDRINUSE') {
				this.instance.log('error', 'Error: Selected port in use.' + err.message)
			}
		})

		// Open the socket.
		this.udpPort.open()

		// When the port is read
		this.udpPort.on('ready', () => {
			this.instance.log('info', `Listening to ZoomOSC on port: ${this.oscTXPort}`)
			this.instance.updateStatus(InstanceStatus.Connecting, 'Listening for first response')
		})

		return
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
				this.oscTXPort,
			)
		} catch (error) {
			this.instance.log(
				'error',
				`sendCommand error for path: ${path} and args: ${JSON.stringify(args)}. Error: ${JSON.stringify(error)}`,
			)
		}
	}
}
