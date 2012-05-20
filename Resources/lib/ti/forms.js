// "Constants"
Object.prototype.merge = function(source) {
  for(var key in source) {
    if(source.hasOwnProperty(key)) {
      this[key] = source[key];
    }
  }
 
  return this;
}

exports.STYLE_HINT = 'hint';
exports.STYLE_LABEL = 'label';

exports.TYPE_DATE = 'date';
exports.TYPE_EMAIL = 'email';
exports.TYPE_NUMBER = 'number';
exports.TYPE_PASSWORD = 'password';
exports.TYPE_PHONE = 'phone';
exports.TYPE_PICKER = 'picker';
exports.TYPE_TEXT = 'text';
exports.TYPE_SUBMIT = 'submit';

//Matt Added
exports.TYPE_TEXTAREA = 'textarea';
exports.TYPE_BUTTON = 'button';
exports.TYPE_VIEW = 'view';

var isAndroid = Ti.Platform.osname === 'android';
var textFieldDefaults = {
	height: '40',
	width: '300dp',
	top: '10dp',
	color: '#222',
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
};
var textAreaDefaults = textFieldDefaults;

textAreaDefaults.height = '120dp';
textAreaDefaults.bottom = 0;

var keyboardMap = {};
keyboardMap[exports.TYPE_EMAIL] = Ti.UI.KEYBOARD_EMAIL;
keyboardMap[exports.TYPE_NUMBER] = Ti.UI.KEYBOARD_NUMBER_PAD;
keyboardMap[exports.TYPE_PASSWORD] = Ti.UI.KEYBOARD_DEFAULT;
keyboardMap[exports.TYPE_PHONE] = Ti.UI.KEYBOARD_NUMBER_PAD;
keyboardMap[exports.TYPE_TEXT] = Ti.UI.KEYBOARD_DEFAULT;

var handleStyle = function(form, fieldObject, title, isHidden, labelRefs) {
	if (form.fieldStyle === exports.STYLE_HINT && (fieldObject.type == 'textField') ) {
		textField.hintText = title;	
	} else {
		
		var id = 'label_'+fieldObject.id;
		
		var label = Ti.UI.createLabel({
			text: title,
			id:id,
			left:0,
			top: '10dp',
			color: '#222',
			font: {
				fontSize: '16dp',
				fontWeight: 'bold'
			},
			height: 'auto',
			width: 'auto'
		});
		form.container.add(label);	
		labelRefs[id] = label;
		if (fieldObject.type == 'textField' && typeof isHidden=='undefined') {
			fieldObject.top = '5dp';	
		}
		if(isHidden)
		{
			label.height = 0;
			fieldObject.height = 0;
		}
	}
};

var setupPickerTextField = function(textField, pickerType, data) {
	textField.editable = false;
	textField.rightButton = Ti.UI.createButton({
		style: Ti.UI.iPhone.SystemButton.DISCLOSURE,
		transform: Ti.UI.create2DMatrix().rotate(90)
	});
	textField.rightButtonMode = Ti.UI.INPUT_BUTTONMODE_ALWAYS;
	
	textField.addEventListener('focus', function(e) {
		e.source.blur(); 
		require('/lib/ti/semiModalPicker').createSemiModalPicker({
			textField: textField,
			value: textField.value,
			type: pickerType,
			data: data
		}).open({animated:true});
	});
};

var ctr = 1;
var addField = function(field, fieldRefs, labelRefs) {
	var title = field.title || ('field' + ctr++);
	var id = field.id;
	var type = field.type || exports.TYPE_TEXT;
	var isHidden = field.isHidden
	var form = this;
	var fieldObject = undefined;
	
	
	
	if (type === exports.TYPE_TEXT ||
		type === exports.TYPE_EMAIL ||
		type === exports.TYPE_NUMBER ||
		type === exports.TYPE_PHONE ||
		type === exports.TYPE_PASSWORD) {
		fieldObject = Ti.UI.createTextField(textFieldDefaults);
		fieldObject.type = 'textField';
		fieldObject.id = id;
		fieldObject.keyboardType = keyboardMap[type];
		fieldObject.value = field.value;
		//fieldObject.visible = false;
		//fieldObject.value = 'test';
		fieldObject.passwordMask = type === exports.TYPE_PASSWORD;
		handleStyle(form, fieldObject, title, isHidden, labelRefs);
	} 
	else if (type === exports.TYPE_TEXTAREA) {
		if (isAndroid) {
			var textAreaOpts = {
/*				  value : 'I am a textarea',*/
/*				  font : {fontSize:14},
				  color : '#888',*/
				  textAlign : 'left'
				  /*appearance : Ti.UI.KEYBOARD_APPEARANCE_ALERT,
				  keyboardType : Ti.UI.KEYBOARD_NUMBERS_PUNCTUATION,
				  returnKeyType : Ti.UI.RETURNKEY_EMERGENCY_CALL*/
			};
		} else {
			
			var textAreaOpts = {backgroundColor:'#FFCCCC'};
			
		}
		
		textAreaOpts.merge(textAreaDefaults);
		Ti.API.info(JSON.stringify(textAreaOpts));
		fieldObject = Ti.UI.createTextArea(textAreaOpts);
		fieldObject.type = type;
		fieldObject.id = id;
		handleStyle(form, fieldObject, title, isHidden, labelRefs);
	}
	
	else if (type === exports.TYPE_DATE) {
		if (isAndroid) {
			fieldObject = Ti.UI.createPicker({
				type: Ti.UI.PICKER_TYPE_DATE,
				value:field.value
			});
			
			//fieldObject.type = type;
			fieldObject.id = id;
			handleStyle(form, fieldObject, title, isHidden, labelRefs);
		} else {
			fieldObject = Ti.UI.createTextField(textFieldDefaults);
			fieldObject.type = type;
			fieldObject.id = id;
			fieldObject.value = field.value;
			handleStyle(form, fieldObject, title, isHidden, labelRefs);
			setupPickerTextField(fieldObject, Ti.UI.PICKER_TYPE_DATE);
		}
		
		
		fieldObject.setLocale(Titanium.Platform.locale); 
        fieldObject.selectionIndicator = true;
		fieldObject.addEventListener("change", function(e){
            form.fireEvent(id, e.value);	
        })
		
	}
	else if (type === exports.TYPE_PICKER) {
		if (isAndroid) {
			fieldObject = Ti.UI.createPicker({
				type: Ti.UI.PICKER_TYPE_PLAIN,
				width: '250dp'
			});
			fieldObject.type = type;
			fieldObject.id = id;
			handleStyle(form, fieldObject, title, isHidden, labelRefs);
			for (var i in field.data) {
				fieldObject.add(Ti.UI.createPickerRow({title:field.data[i]}));	
			}
		} else {
			fieldObject = Ti.UI.createTextField(textFieldDefaults);
			fieldObject.type = type;
			fieldObject.id = id;
			handleStyle(form, fieldObject, title, isHidden, labelRefs);
			setupPickerTextField(fieldObject, Ti.UI.PICKER_TYPE_PLAIN, field.data);
		}
		fieldObject.addEventListener("change", function(e){
            form.fireEvent(id, e.value);	
        })
	} else if (type === exports.TYPE_SUBMIT  || type === exports.TYPE_BUTTON ) {
		var buttonHeight = (isHidden) ? 0 : '40dp';
		var fieldObject = Ti.UI.createButton({
			title: title,
			id:id,
			height: buttonHeight,
			width: '100dp',
			top:0
		});
		fieldObject.id = id;
		
		fieldObject.addEventListener('click', function(e) {
			form.fireEvent(id);	
		});	
		form.container.add(fieldObject);
	}
	
	
	
	//fieldObject.type = 'a'; //Matt Added
	// Add our prepared UI component to the form
	if (fieldObject) {
		fieldObject.left = 0;
		form.container.add(fieldObject);
		fieldRefs[id] = fieldObject;
	}
};

var addFields = function(fields, fieldRefs, labelRefs) {
	for (var i in fields) {
		Ti.API.info(JSON.stringify(fieldRefs));
		Ti.API.info(JSON.stringify(labelRefs));
		Ti.API.info(JSON.stringify(fields[i]));
		this.addField(fields[i], fieldRefs, labelRefs);
	}
};

exports.createForm = function(o) {
	var container = Ti.UI.createView({
		top:50,
		left:'10dp',
		layout: 'vertical',
		height: Ti.UI.SIZE,
		width:Ti.UI.SIZE
	});
	var fieldRefs = {};
	var labelRefs = {};
	var form = Ti.UI.createScrollView({
		left:0,
		contentHeight: 'auto',
		contentWidth: 'auto',
		scrollType:'vertical',
		showVerticalScrollIndicator:true,
		showHorizontalScrollIndicator:false,
    	
		// new stuff
		container: container,
		fieldStyle: o.style || exports.STYLE_HINT,
		addField: addField,
		addFields: addFields
	});

	form.addFields(o.fields, fieldRefs, labelRefs);
	form.add(container);
	
	// Add this so each field can be accessed directly, if necessary
	form.fieldRefs = fieldRefs;
	form.labelRefs = labelRefs;
	return form;
};
