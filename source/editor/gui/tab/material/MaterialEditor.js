import {Scene, PerspectiveCamera, Object3D, FrontSide, BackSide, DoubleSide, NeverDepth, AlwaysDepth, LessDepth, LessEqualDepth, GreaterEqualDepth, GreaterDepth, NotEqualDepth, NoBlending, NormalBlending, AdditiveBlending, SubtractiveBlending, MultiplyBlending, SphereBufferGeometry, TorusBufferGeometry, BoxBufferGeometry, TorusKnotBufferGeometry, ConeBufferGeometry, Quaternion, Euler} from "three";
import {Locale} from "../../../locale/LocaleManager.js";
import {Mouse} from "../../../../core/input/Mouse.js";
import {ChangeAction} from "../../../history/action/ChangeAction.js";
import {Global} from "../../../Global.js";
import {Editor} from "../../../Editor.js";
import {TabComponent} from "../../../components/tabs/TabComponent.js";
import {TableForm} from "../../../components/TableForm.js";
import {RendererCanvas} from "../../../components/RendererCanvas.js";
import {TextBox} from "../../../components/input/TextBox.js";
import {Slider} from "../../../components/input/Slider.js";
import {NumberBox} from "../../../components/input/NumberBox.js";
import {DropdownList} from "../../../components/input/DropdownList.js";
import {CheckBox} from "../../../components/input/CheckBox.js";
import {DualDivision} from "../../../components/containers/DualDivision.js";
import {DualContainer} from "../../../components/containers/DualContainer.js";

function MaterialEditor(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.material, Global.FILE_PATH + "icons/misc/material.png");

	var self = this;

	// Canvas
	this.canvas = new RendererCanvas();
	this.canvas.setOnResize(function(x, y)
	{
		self.camera.aspect = x / y;
		self.camera.updateProjectionMatrix();
	});

	// Mouse
	this.mouse = new Mouse(window, true);
	this.mouse.setCanvas(this.canvas.element);

	// Material and corresponding asset
	this.material = null;
	this.asset = null;

	// Preview scene
	this.scene = new Scene();

	// Camera
	this.camera = new PerspectiveCamera(80, this.canvas.size.x / this.canvas.size.y);
	this.camera.position.set(0, 0, 2.5);

	// Interactive object
	this.interactive = new Object3D();
	this.scene.add(this.interactive);

	// Preview configuration
	this.previewForm = new TableForm();
	this.previewForm.setAutoSize(false);

	// Configuration text
	this.previewForm.addText(Locale.configuration);
	this.previewForm.nextRow();

	// Form
	this.form = new TableForm();
	this.form.setAutoSize(false);

	// Name
	this.form.addText(Locale.name);
	this.name = new TextBox(this.form);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "name", self.name.getText()));
	});
	this.form.add(this.name);
	this.form.nextRow();

	// Side
	this.form.addText(Locale.side);
	this.side = new DropdownList(this.form);
	this.side.size.set(100, 18);
	this.side.addValue(Locale.front, FrontSide);
	this.side.addValue(Locale.back, BackSide);
	this.side.addValue(Locale.double, DoubleSide);
	this.side.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "side", self.side.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.side);
	this.form.nextRow();

	// Tone mapping
	this.form.addText(Locale.toneMapped);
	this.toneMapped = new CheckBox(this.form);
	this.toneMapped.size.set(18, 18);
	this.toneMapped.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "toneMapped", self.toneMapped.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.toneMapped);
	this.form.nextRow();

	// Test depth
	this.form.addText(Locale.depthTest);
	this.depthTest = new CheckBox(this.form);
	this.depthTest.size.set(18, 18);
	this.depthTest.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "depthTest", self.depthTest.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.depthTest);
	this.form.nextRow();
	
	// Write depth
	this.form.addText(Locale.depthWrite);
	this.depthWrite = new CheckBox(this.form);
	this.depthWrite.size.set(18, 18);
	this.depthWrite.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "depthWrite", self.depthWrite.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.depthWrite);
	this.form.nextRow();

	// Depth func
	this.form.addText(Locale.depthMode);
	this.depthFunc = new DropdownList(this.form);
	this.depthFunc.size.set(100, 18);
	this.depthFunc.addValue(Locale.never, NeverDepth);
	this.depthFunc.addValue(Locale.always, AlwaysDepth);
	this.depthFunc.addValue(Locale.less, LessDepth);
	this.depthFunc.addValue(Locale.lessOrEqual, LessEqualDepth);
	this.depthFunc.addValue(Locale.greaterOrEqual, GreaterEqualDepth);
	this.depthFunc.addValue(Locale.greater, GreaterDepth);
	this.depthFunc.addValue(Locale.notEqual, NotEqualDepth);
	this.depthFunc.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "depthFunc", self.depthFunc.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.depthFunc);
	this.form.nextRow();

	// Transparent
	this.form.addText(Locale.transparent);
	this.transparent = new CheckBox(this.form);
	this.transparent.size.set(18, 18);
	this.transparent.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "transparent", self.transparent.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.transparent);
	this.form.nextRow();

	// Dithering
	this.form.addText(Locale.dithering);
	this.dithering = new CheckBox(this.form);
	this.dithering.size.set(18, 18);
	this.dithering.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "dithering", self.dithering.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.dithering);
	this.form.nextRow();

	// Premultiplied Alpha
	this.form.addText(Locale.premultipliedAlpha);
	this.premultipliedAlpha = new CheckBox(this.form);
	this.premultipliedAlpha.size.set(18, 18);
	this.premultipliedAlpha.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "premultipliedAlpha", self.premultipliedAlpha.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.premultipliedAlpha);
	this.form.nextRow();

	// Opacity level
	this.form.addText(Locale.opacity);
	this.opacity = new Slider(this.form);
	this.opacity.size.set(160, 18);
	this.opacity.setRange(0, 1);
	this.opacity.setStep(0.01);
	this.opacity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "opacity", self.opacity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.opacity);
	this.form.nextRow();
	
	// Alpha test
	this.form.addText(Locale.alphaTest);
	this.alphaTest = new Slider(this.form);
	this.alphaTest.size.set(160, 18);
	this.alphaTest.setRange(0, 1);
	this.alphaTest.setStep(0.01);
	this.alphaTest.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "alphaTest", self.alphaTest.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.alphaTest);
	this.form.nextRow();
	
	// Blending mode
	this.form.addText(Locale.blendingMode);
	this.blending = new DropdownList(this.form);
	this.blending.size.set(100, 18);
	this.blending.addValue(Locale.none, NoBlending);
	this.blending.addValue(Locale.normal, NormalBlending);
	this.blending.addValue(Locale.additive, AdditiveBlending);
	this.blending.addValue(Locale.subtractive, SubtractiveBlending);
	this.blending.addValue(Locale.multiply, MultiplyBlending);
	this.blending.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "blending", self.blending.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.blending);
	this.form.nextRow();

	// Premultiplied Alpha
	this.form.addText(Locale.premultipliedAlpha);
	this.premultipliedAlpha = new CheckBox(this.form);
	this.premultipliedAlpha.size.set(18, 18);
	this.premultipliedAlpha.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "premultipliedAlpha", self.premultipliedAlpha.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.premultipliedAlpha);
	this.form.nextRow();

	// Vertex Colors
	this.form.addText(Locale.vertexColors);
	this.vertexColors = new CheckBox(this.form);
	this.vertexColors.size.set(18, 18);
	this.vertexColors.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "vertexColors", self.vertexColors.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.vertexColors);
	this.form.nextRow();

	// Polygon Offset
	this.form.addText(Locale.polygonOffset);
	this.polygonOffset = new CheckBox(this.form);
	this.polygonOffset.size.set(18, 18);
	this.polygonOffset.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "polygonOffset", self.polygonOffset.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.polygonOffset);
	this.form.nextRow();

	// Polygon Offset Factor
	this.form.addText(Locale.polygonOffsetFactor);
	this.polygonOffsetFactor = new NumberBox(this.form);
	this.polygonOffsetFactor.size.set(60, 18);
	this.polygonOffsetFactor.setStep(0.001);
	this.polygonOffsetFactor.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "polygonOffsetFactor", self.polygonOffsetFactor.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.polygonOffsetFactor);
	this.form.nextRow();

	// Polygon Offset Units
	this.form.addText(Locale.polygonOffsetUnits);
	this.polygonOffsetUnits = new NumberBox(this.form);
	this.polygonOffsetUnits.size.set(60, 18);
	this.polygonOffsetUnits.setStep(0.001);
	this.polygonOffsetUnits.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "polygonOffsetUnits", self.polygonOffsetUnits.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.polygonOffsetUnits);
	this.form.nextRow();

	// Preview
	this.preview = new DualContainer();
	this.preview.orientation = DualDivision.VERTICAL;
	this.preview.tabPosition = 0.8;
	this.preview.tabPositionMin = 0.3;
	this.preview.tabPositionMax = 0.8;
	this.preview.attachA(this.canvas);
	this.preview.attachB(this.previewForm);

	// Main
	this.main = new DualContainer(this);
	this.main.tabPosition = 0.5;
	this.main.tabPositionMin = 0.05;
	this.main.tabPositionMax = 0.95;
	this.main.attachA(this.preview);
	this.main.attachB(this.form);
}

MaterialEditor.geometries = [
	[Locale.sphere, new SphereBufferGeometry(1, 40, 40)],
	[Locale.torus, new TorusBufferGeometry(0.8, 0.4, 32, 64)],
	[Locale.cube, new BoxBufferGeometry(1, 1, 1, 1, 1, 1)],
	[Locale.torusKnot, new TorusKnotBufferGeometry(0.7, 0.3, 128, 64)],
	[Locale.cone, new ConeBufferGeometry(1, 2, 32)]
];

MaterialEditor.prototype = Object.create(TabComponent.prototype);

// Attach material to material editor
MaterialEditor.prototype.attach = function(material, asset)
{
	// Material asset
	if (asset !== undefined)
	{
		this.asset = asset;
	}
	
	// Store material
	this.material = material;
	this.material.needsUpdate = true;

	this.updateMetadata();

	// Generic material elements
	this.name.setText(material.name);
	this.side.setValue(material.side);
	this.depthTest.setValue(material.depthTest);
	this.depthWrite.setValue(material.depthWrite);
	this.depthFunc.setValue(material.depthFunc);
	this.transparent.setValue(material.transparent);
	this.opacity.setValue(material.opacity);
	this.alphaTest.setValue(material.alphaTest);
	this.blending.setValue(material.blending);
	this.premultipliedAlpha.setValue(material.premultipliedAlpha);
	this.dithering.setValue(material.dithering);
	this.toneMapped.setValue(material.toneMapped);
	this.vertexColors.setValue(material.vertexColors);
	this.polygonOffset.setValue(material.polygonOffset);
	this.polygonOffsetFactor.setValue(material.polygonOffsetFactor);
	this.polygonOffsetUnits.setValue(material.polygonOffsetUnits);
};

MaterialEditor.prototype.isAttached = function(material)
{
	return this.material === material;
};

MaterialEditor.prototype.activate = function()
{
	TabComponent.prototype.activate.call(this);
	
	this.mouse.create();
};

MaterialEditor.prototype.deactivate = function()
{
	TabComponent.prototype.deactivate.call(this);
	
	this.mouse.dispose();
};

MaterialEditor.prototype.destroy = function()
{
	TabComponent.prototype.destroy.call(this);

	this.mouse.dispose();
	this.canvas.destroy();
};

// Update object data
MaterialEditor.prototype.updateMetadata = function()
{
	if (this.material !== null)
	{
		// Set name
		if (this.material.name !== undefined)
		{
			this.setName(this.material.name);
			this.name.setText(this.material.name);
		}

		this.scene.background = this.material.envMap !== null ? this.material.envMap : null;

		// If not found close tab
		if (Editor.program.materials[this.material.uuid] === undefined)
		{
			this.close();
		}
	}
};

// Update material editor
MaterialEditor.prototype.update = function()
{
	this.mouse.update();

	// Render Material
	if (this.material !== null)
	{
		// If needs update file metadata
		if (this.material.needsUpdate)
		{
			Editor.updateObjectsViewsGUI();
			
			this.scene.background = this.material.envMap !== null ? this.material.envMap : null;

			this.material.needsUpdate = true;
		}

		// Render scene
		this.canvas.renderer.render(this.scene, this.camera);
	}

	// Move material view
	if (this.mouse.insideCanvas())
	{
		// Zoom
		this.camera.position.z += this.camera.position.z * this.mouse.wheel * 0.001;

		// Rotate object
		if (this.mouse.buttonPressed(Mouse.LEFT))
		{
			var delta = new Quaternion();
			delta.setFromEuler(new Euler(this.mouse.delta.y * 0.005, this.mouse.delta.x * 0.005, 0, 'XYZ'));
			
			this.interactive.quaternion.multiplyQuaternions(delta, this.interactive.quaternion);
		}
	}
};

// Update elements
MaterialEditor.prototype.updateSize = function()
{	
	TabComponent.prototype.updateSize.call(this);

	this.main.size.copy(this.size);
	this.main.updateInterface();

	this.previewForm.updateInterface();
	this.form.updateInterface();
};

export {MaterialEditor};
