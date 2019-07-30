(function() {
	let position = new mp.Vector3(0, 0, 200);
	let rotation = new mp.Vector3(0, 0, 0);

	const camera = mp.cameras.new("default", position, rotation, 60);

	mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
	mp.players.local.setAlpha(0);
	mp.players.local.setInvincible(true);

	camera.setActive(true);
	mp.game.cam.renderScriptCams(true, false, 0, true, false);

	mp.game.ui.displayHud(false);
	mp.game.ui.displayRadar(false);
	mp.gui.chat.show(false);

	const i = {
		FRONTEND_AXIS_X: 195,
		FRONTEND_AXIS_Y: 196,
		FRONTEND_RIGHT_AXIS_X: 197,
		FRONTEND_RIGHT_AXIS_Y: 198,
		FRONTEND_RS: 210,
		CURSOR_X: 239,
		CURSOR_Y: 240,
	};

	const ig = {
		FRONTEND_LSTICK_ALL: 9,
		FRONTEND_RSTICK_ALL: 10,
		CURSOR: 28,
	};

	const quad = v => {
		return Math.sign(v) * v * v;
	};

	const inverse = v => {
		return v * -1;
	};

	mp.events.add("render", () => {
		const x = (mp.game.controls.getControlValue(ig.CURSOR, i.CURSOR_X) / 254 - 0.5) * 4 - 1;
		const y = (mp.game.controls.getControlValue(ig.CURSOR, i.CURSOR_Y) / 254 - 0.5) * 4 - 1;
		const x2 = (mp.game.controls.getControlValue(ig.FRONTEND_LSTICK_ALL, i.FRONTEND_AXIS_X) / 254) * 2 - 1;
		const y2 = (mp.game.controls.getControlValue(ig.FRONTEND_LSTICK_ALL, i.FRONTEND_AXIS_Y) / 254) * 2 - 1;
		const x3 = (mp.game.controls.getControlValue(ig.FRONTEND_RSTICK_ALL, i.FRONTEND_RIGHT_AXIS_X) / 254) * 2 - 1;
		const y3 = (mp.game.controls.getControlValue(ig.FRONTEND_RSTICK_ALL, i.FRONTEND_RIGHT_AXIS_Y) / 254) * 2 - 1;

		const ctrl = mp.game.controls.isControlPressed(ig.FRONTEND_RSTICK_ALL, i.FRONTEND_RS);

		const force = new mp.Vector3(quad(x2), inverse(quad(y2)), quad(x3));
		const motion = new mp.Vector3(inverse(quad(y)), quad(y3), inverse(quad(x)));

		const offset = force.multiply(ctrl ? 5 : 0.5);
		rotation = rotation.add(motion.multiply(ctrl ? 5 : 0.5));
		rotation = new mp.Vector3(rotation.x % 360, rotation.y % 360, rotation.z % 360);
		position = mp.players.local.getOffsetFromInWorldCoords(offset.x, offset.y, offset.z);

		mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
		mp.players.local.setRotation(rotation.x, rotation.y, rotation.z, 0, true);

		camera.setCoord(position.x, position.y, position.z);
		camera.setRot(rotation.x, rotation.y, rotation.z, 2);
	});
})();
