import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ZoomConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { OSC } from './osc.js'

export class ZoomInstance extends InstanceBase<ZoomConfig> {
	public config: ZoomConfig = {
		host: '',
		rx_port: 3456,
	}
	public OSC: OSC | null = null

	constructor(internal: unknown) {
		super(internal)
		this.instanceOptions.disableVariableValidation = true
	}

	async init(config: ZoomConfig): Promise<void> {
		this.config = config
		await this.configUpdated(config)

		this.updateStatus(InstanceStatus.Ok)
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ZoomConfig): Promise<void> {
		this.config = config
		this.saveConfig(config)
		this.log('info', 'Changing Config!')

		if (this.OSC) this.OSC.destroy()
		this.OSC = new OSC(this)
		this.updateInstance()
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	/**
	 * @description sets actions, variables, presets and feedbacks available for this instance
	 */
	public updateInstance(): void {
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updateStatus(InstanceStatus.Ok)
	}
}

runEntrypoint(ZoomInstance, UpgradeScripts)
