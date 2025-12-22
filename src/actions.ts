import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'
import { InstanceBaseExt } from './utils.js'
import { ZoomConfig } from './config.js'
import { ActionIdBlock, GetActionsBlock } from './actions/action-block.js'
import { ActionIdCapture, GetActionsCapture } from './actions/action-capture.js'
import { ActionIdConfig, GetActionsConfig } from './actions/action-config.js'
import { ActionIdFavorite, GetActionsFavorite } from './actions/action-favorite.js'
import { ActionIdGalleryTimer, GetActionsGalleryTimer } from './actions/action-gallery-timer.js'
import { ActionIdJoinLeave, GetActionsJoinLeave } from './actions/action-join-leave.js'
import { ActionIdReplace, GetActionsReplace } from './actions/action-replace.js'

export enum ActionId {}

export function GetActions(instance: InstanceBaseExt<ZoomConfig>): CompanionActionDefinitions {
	const actionsBlock: {
		[id in ActionIdBlock]: CompanionActionDefinition | undefined
	} = GetActionsBlock(instance)

	const actionsCapture: {
		[id in ActionIdCapture]: CompanionActionDefinition | undefined
	} = GetActionsCapture(instance)

	const actionsIdConfig: {
		[id in ActionIdConfig]: CompanionActionDefinition | undefined
	} = GetActionsConfig(instance)

	const actionsIdFavorite: {
		[id in ActionIdFavorite]: CompanionActionDefinition | undefined
	} = GetActionsFavorite(instance)

	const actionsIdGalleryTimer: {
		[id in ActionIdGalleryTimer]: CompanionActionDefinition | undefined
	} = GetActionsGalleryTimer(instance)

	const actionsIdJoinLeave: {
		[id in ActionIdJoinLeave]: CompanionActionDefinition | undefined
	} = GetActionsJoinLeave(instance)

	const actionsIdReplace: {
		[id in ActionIdReplace]: CompanionActionDefinition | undefined
	} = GetActionsReplace(instance)

	const actions: {
		[id in
			| ActionId
			| ActionIdBlock
			| ActionIdCapture
			| ActionIdConfig
			| ActionIdFavorite
			| ActionIdGalleryTimer
			| ActionIdJoinLeave
			| ActionIdReplace]: CompanionActionDefinition | undefined
	} = {
		...actionsBlock,
		...actionsCapture,
		...actionsIdConfig,
		...actionsIdFavorite,
		...actionsIdGalleryTimer,
		...actionsIdJoinLeave,
		...actionsIdReplace,
	}

	return actions
}
