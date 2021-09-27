"use strict";

class DuccTrader {

	constructor() {
		this.mod = "ducc-DuccTrader";
		this.funcptr = HttpServer.onRespond["IMAGE"];

		Logger.info(`Loading: ${this.mod}`);
		ModLoader.onLoad[this.mod] = this.load.bind(this);
		HttpServer.onRespond["IMAGE"] = this.getImage.bind(this);
	}

	createAssort() {
		return {
			"items": [
				{
					"_id": "snaccPack",
					"_tpl": "snaccPack",
					"parentId": "hideout",
					"slotId": "hideout",
					"upd": {
						"UnlimitedCount": true,
						"StackObjectsCount": 999999999
					}
				}
			],

			"barter_scheme": {
				"snaccPack": [
					[
						{"count": 120000, "_tpl": "5449016a4bdc2d6f028b456f"}
					]
				]
			},

			"loyalty_levels": {
				"snaccPack": 1
			}
		};
	}

	getImage(sessionID, req, resp, body) {
		const filepath = `${ModLoader.getModPath(this.mod)}avatar/`;

		if (req.url.includes("/avatar/ducc")) {
			HttpServer.sendFile(resp, `${filepath}/ducc.jpg`);
			return;
		}

		this.funcptr(sessionID, req, resp, body);
	}

	load() {
		const filepath = `${ModLoader.getModPath(this.mod)}db/`;
		let base = JsonUtil.deserialize(VFS.readFile(`${filepath}/base.json`));
		let locales = DatabaseServer.tables.locales.global;
		const config = require("../config.json").duccTrader;

		if (!config.enabled) {
			Logger.error("Cancelled loading duccTrader; disabled in config");
			return
		}

		if (config.enabled_insurance) {
			base.insurance.availablity = true;
		} if (config.enabled_repair) {
			base.repair.availablity = true;
		}

		DatabaseServer.tables.traders.ducc = {
			"base": base,
			"assort": this.createAssort(),
			"dialogue": {
				"insuranceStart": [
					"5a8fd75188a45036844e0aef"
				],
				"insuranceFound": [
					"5a8fd75188a45036844e0ae1"
				],
				"insuranceExpired": [
					"5a8fd75188a45036844e0aeb"
				],
				"insuranceComplete": [
					"5a8fd75188a45036844e0af5"
				],
				"insuranceFailed": [
					"5a8fd75188a45036844e0b0c"
				]
			},
			"questassort": {
				"started": {},
				"success": {},
				"fail": {}
			},
			"suits": {}
		};

		for (const locale in locales) {
			locales[locale].trading.ducc = {
				FullName: "Ducc",
				FirstName: "Ducc",
				Nickname: "Ducc",
				Location: "Somewhere Underground",
				Description: "Sells stuff and things, might give you a discount for some bread",
			};
		}

		DatabaseServer.tables.locales.global = locales;
	}
}

module.exports.Mod = DuccTrader;
