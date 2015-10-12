/**
 * swagger-ui - Swagger UI is a dependency-free collection of HTML, Javascript, and CSS assets that dynamically generate beautiful documentation from a Swagger-compliant API
 * @version v2.1.8-M1
 * @link http://swagger.io
 * @license Apache 2.0
 */
 
//$ = jQuery.noConflict(true); 
 
jQuery(function() {

	// Helper function for vertically aligning DOM elements
	// http://www.seodenver.com/simple-vertical-align-plugin-for-jquery/
	jQuery.fn.vAlign = function() {
		return this.each(function(i){
		var ah = jQuery(this).height();
		var ph = jQuery(this).parent().height();
		var mh = (ph - ah) / 2;
		jQuery(this).css('margin-top', mh);
		});
	};

	jQuery.fn.stretchFormtasticInputWidthToParent = function() {
		return this.each(function(i){
		var p_width = jQuery(this).closest("form").innerWidth();
		var p_padding = parseInt(jQuery(this).closest("form").css('padding-left') ,10) + parseInt(jQuery(this).closest("form").css('padding-right'), 10);
		var this_padding = parseInt(jQuery(this).css('padding-left'), 10) + parseInt(jQuery(this).css('padding-right'), 10);
		jQuery(this).css('width', p_width - p_padding - this_padding);
		});
	};

	jQuery('form.formtastic li.string input, form.formtastic textarea').stretchFormtasticInputWidthToParent();

	// Vertically center these paragraphs
	// Parent may need a min-height for this to work..
	jQuery('ul.downplayed li div.content p').vAlign();

	// When a sandbox form is submitted..
	jQuery("form.sandbox").submit(function(){

		var error_free = true;

		// Cycle through the forms required inputs
 		jQuery(this).find("input.required").each(function() {

			// Remove any existing error styles from the input
			jQuery(this).removeClass('error');

			// Tack the error style on if the input is empty..
			if (jQuery(this).val() == '') {
				jQuery(this).addClass('error');
				jQuery(this).wiggle();
				error_free = false;
			}

		});

		return error_free;
	});

});

function clippyCopiedCallback(a) {
  jQuery('#api_key_copied').fadeIn().delay(1000).fadeOut();

  // var b = jQuery("#clippy_tooltip_" + a);
  // b.length != 0 && (b.attr("title", "copied!").trigger("tipsy.reload"), setTimeout(function() {
  //   b.attr("title", "copy to clipboard")
  // },
  // 500))
}

// Logging function that accounts for browsers that don't have window.console
log = function(){
  log.history = log.history || [];
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments)[0] );
  }
};

// Handle browsers that do console incorrectly (IE9 and below, see http://stackoverflow.com/a/5539378/7913)
if (Function.prototype.bind && console && typeof console.log == "object") {
    [
      "log","info","warn","error","assert","dir","clear","profile","profileEnd"
    ].forEach(function (method) {
        console[method] = this.bind(console[method], console);
    }, Function.prototype.call);
}

var Docs = {

	shebang: function() {

		// If shebang has an operation nickname in it..
		// e.g. /docs/#!/words/get_search
		var fragments = jQuery.param.fragment().split('/');
		fragments.shift(); // get rid of the bang

		switch (fragments.length) {
			case 1:
				// Expand all operations for the resource and scroll to it
				var dom_id = 'resource_' + fragments[0];

				Docs.expandEndpointListForResource(fragments[0]);
				jQuery("#"+dom_id).slideto({highlight: false});
				break;
			case 2:
				// Refer to the endpoint DOM element, e.g. #words_get_search

        // Expand Resource
        Docs.expandEndpointListForResource(fragments[0]);
        jQuery("#"+dom_id).slideto({highlight: false});

        // Expand operation
				var li_dom_id = fragments.join('_');
				var li_content_dom_id = li_dom_id + "_content";


				Docs.expandOperation(jQuery('#'+li_content_dom_id));
				jQuery('#'+li_dom_id).slideto({highlight: false});
				break;
		}

	},

	toggleEndpointListForResource: function(resource) {
		var elem = jQuery('li#resource_' + Docs.escapeResourceName(resource) + ' ul.endpoints');
		if (elem.is(':visible')) {
			Docs.collapseEndpointListForResource(resource);
		} else {
			Docs.expandEndpointListForResource(resource);
		}
	},

	// Expand resource
	expandEndpointListForResource: function(resource) {
		var resource = Docs.escapeResourceName(resource);
		if (resource == '') {
			jQuery('.resource ul.endpoints').slideDown();
			return;
		}
		
		jQuery('li#resource_' + resource).addClass('active');

		var elem = jQuery('li#resource_' + resource + ' ul.endpoints');
		elem.slideDown();
	},

	// Collapse resource and mark as explicitly closed
	collapseEndpointListForResource: function(resource) {
		var resource = Docs.escapeResourceName(resource);
		if (resource == '') {
			jQuery('.resource ul.endpoints').slideUp();
			return;
		}

		jQuery('li#resource_' + resource).removeClass('active');

		var elem = jQuery('li#resource_' + resource + ' ul.endpoints');
		elem.slideUp();
	},

	expandOperationsForResource: function(resource) {
		// Make sure the resource container is open..
		Docs.expandEndpointListForResource(resource);
		
		if (resource == '') {
			jQuery('.resource ul.endpoints li.operation div.content').slideDown();
			return;
		}

		jQuery('li#resource_' + Docs.escapeResourceName(resource) + ' li.operation div.content').each(function() {
			Docs.expandOperation(jQuery(this));
		});
	},

	collapseOperationsForResource: function(resource) {
		// Make sure the resource container is open..
		Docs.expandEndpointListForResource(resource);

		if (resource == '') {
			jQuery('.resource ul.endpoints li.operation div.content').slideUp();
			return;
		}

		jQuery('li#resource_' + Docs.escapeResourceName(resource) + ' li.operation div.content').each(function() {
			Docs.collapseOperation(jQuery(this));
		});
	},

	escapeResourceName: function(resource) {
		return resource.replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g, "\\$&");
	},

	expandOperation: function(elem) {
		elem.slideDown();
	},

	collapseOperation: function(elem) {
		elem.slideUp();
	}
};

var SwaggerUi,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SwaggerUi = (function(superClass) {
  extend(SwaggerUi, superClass);

  function SwaggerUi() {
    return SwaggerUi.__super__.constructor.apply(this, arguments);
  }

  SwaggerUi.prototype.dom_id = "swagger_ui";

  SwaggerUi.prototype.options = null;

  SwaggerUi.prototype.api = null;

  SwaggerUi.prototype.headerView = null;

  SwaggerUi.prototype.mainView = null;

  SwaggerUi.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    if (options.dom_id != null) {
      this.dom_id = options.dom_id;
      delete options.dom_id;
    }
    if (options.supportedSubmitMethods == null) {
      options.supportedSubmitMethods = ['get', 'put', 'post', 'delete', 'head', 'options', 'patch'];
    }
    if (jQuery('#' + this.dom_id) == null) {
      jQuery('body').append('<div id="' + this.dom_id + '"></div>');
    }
    this.options = options;
    this.options.success = (function(_this) {
      return function() {
        return _this.render();
      };
    })(this);
    this.options.progress = (function(_this) {
      return function(d) {
        return _this.showMessage(d);
      };
    })(this);
    this.options.failure = (function(_this) {
      return function(d) {
        return _this.onLoadFailure(d);
      };
    })(this);
    this.headerView = new HeaderView({
      el: jQuery('#header')
    });
    return this.headerView.on('update-swagger-ui', (function(_this) {
      return function(data) {
        return _this.updateSwaggerUi(data);
      };
    })(this));
  };

  SwaggerUi.prototype.setOption = function(option, value) {
    return this.options[option] = value;
  };

  SwaggerUi.prototype.getOption = function(option) {
    return this.options[option];
  };

  SwaggerUi.prototype.updateSwaggerUi = function(data) {
    this.options.url = data.url;
    return this.load();
  };

  SwaggerUi.prototype.load = function() {
    var ref, url;
    if ((ref = this.mainView) != null) {
      ref.clear();
    }
    url = this.options.url;
    if (url && url.indexOf("http") !== 0) {
      url = this.buildUrl(window.location.href.toString(), url);
    }
    this.options.url = url;
    this.headerView.update(url);
    return this.api = new SwaggerClient(this.options);
  };

  SwaggerUi.prototype.collapseAll = function() {
    return Docs.collapseEndpointListForResource('');
  };

  SwaggerUi.prototype.listAll = function() {
    return Docs.collapseOperationsForResource('');
  };

  SwaggerUi.prototype.expandAll = function() {
    return Docs.expandOperationsForResource('');
  };

  SwaggerUi.prototype.render = function() {
    this.showMessage('Finished Loading Resource Information. Rendering Swagger UI...');
    this.mainView = new MainView({
      model: this.api,
      el: jQuery('#' + this.dom_id),
      swaggerOptions: this.options
    }).render();
    this.showMessage();
    switch (this.options.docExpansion) {
      case "full":
        this.expandAll();
        break;
      case "list":
        this.listAll();
    }
    this.renderGFM();
    if (this.options.onComplete) {
      this.options.onComplete(this.api, this);
    }
    return setTimeout((function(_this) {
      return function() {
        return Docs.shebang();
      };
    })(this), 100);
  };

  SwaggerUi.prototype.buildUrl = function(base, url) {
    var endOfPath, parts;
    if (url.indexOf("/") === 0) {
      parts = base.split("/");
      base = parts[0] + "//" + parts[2];
      return base + url;
    } else {
      endOfPath = base.length;
      if (base.indexOf("?") > -1) {
        endOfPath = Math.min(endOfPath, base.indexOf("?"));
      }
      if (base.indexOf("#") > -1) {
        endOfPath = Math.min(endOfPath, base.indexOf("#"));
      }
      base = base.substring(0, endOfPath);
      if (base.indexOf("/", base.length - 1) !== -1) {
        return base + url;
      }
      return base + "/" + url;
    }
  };

  SwaggerUi.prototype.showMessage = function(data) {
    if (data == null) {
      data = '';
    }
    jQuery('#message-bar').removeClass('message-fail');
    jQuery('#message-bar').addClass('message-success');
    return jQuery('#message-bar').html(data);
  };

  SwaggerUi.prototype.onLoadFailure = function(data) {
    var val;
    if (data == null) {
      data = '';
    }
    jQuery('#message-bar').removeClass('message-success');
    jQuery('#message-bar').addClass('message-fail');
    val = jQuery('#message-bar').html(data);
    if (this.options.onFailure != null) {
      this.options.onFailure(data);
    }
    return val;
  };

  SwaggerUi.prototype.renderGFM = function(data) {
    if (data == null) {
      data = '';
    }
    return jQuery('.markdown').each(function(index) {
      return jQuery(this).html(marked(jQuery(this).html()));
    });
  };

  return SwaggerUi;

})(Backbone.Router);

window.SwaggerUi = SwaggerUi;

this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["apikey_button_view"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<!--div class='auth_button' id='apikey_button'><img class='auth_icon' alt='apply api key' src='images/apikey.jpeg'></div-->\n<div class='auth_container' id='apikey_container'>\n  <div class='key_input_container'>\n    <div class='auth_label'>"
    + this.escapeExpression(((helper = (helper = helpers.keyName || (depth0 != null ? depth0.keyName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"keyName","hash":{},"data":data}) : helper)))
    + "</div>\n    <input placeholder=\"api_key\" class=\"auth_input\" id=\"input_apiKey_entry\" name=\"apiKey\" type=\"text\"/>\n    <div class='auth_submit'><a class='auth_submit_button' id=\"apply_api_key\" href=\"#\">apply</a></div>\n  </div>\n</div>\n\n";
},"useData":true});
Handlebars.registerHelper('sanitize', function(html) {
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  return new Handlebars.SafeString(html);
});

this["Handlebars"]["templates"]["basic_auth_button_view"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class='auth_button' id='basic_auth_button'><img class='auth_icon' src='images/password.jpeg'></div>\n<div class='auth_container' id='basic_auth_container'>\n  <div class='key_input_container'>\n    <div class=\"auth_label\">Username</div>\n    <input placeholder=\"username\" class=\"auth_input\" id=\"input_username\" name=\"username\" type=\"text\"/>\n    <div class=\"auth_label\">Password</div>\n    <input placeholder=\"password\" class=\"auth_input\" id=\"input_password\" name=\"password\" type=\"password\"/>\n    <div class='auth_submit'><a class='auth_submit_button' id=\"apply_basic_auth\" href=\"#\">apply</a></div>\n  </div>\n</div>\n\n";
},"useData":true});
var ApiKeyButton,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ApiKeyButton = (function(superClass) {
  extend(ApiKeyButton, superClass);

  function ApiKeyButton() {
    return ApiKeyButton.__super__.constructor.apply(this, arguments);
  }

  ApiKeyButton.prototype.initialize = function() {};

  ApiKeyButton.prototype.render = function() {
    var template;
    template = this.template();
    jQuery(this.el).html(template(this.model));
    return this;
  };

  ApiKeyButton.prototype.events = {
    "click #apikey_button": "toggleApiKeyContainer",
    "click #apply_api_key": "applyApiKey"
  };

  ApiKeyButton.prototype.applyApiKey = function() {
    var elem;
    window.authorizations.add(this.model.name, new ApiKeyAuthorization(this.model.name, jQuery("#input_apiKey_entry").val(), this.model["in"]));
    window.swaggerUi.load();
    return elem = jQuery('#apikey_container').show();
  };

  ApiKeyButton.prototype.toggleApiKeyContainer = function() {
    var elem;
    if (jQuery('#apikey_container').length > 0) {
      elem = jQuery('#apikey_container').first();
      if (elem.is(':visible')) {
        return elem.hide();
      } else {
        jQuery('.auth_container').hide();
        return elem.show();
      }
    }
  };

  ApiKeyButton.prototype.template = function() {
    return Handlebars.templates.apikey_button_view;
  };

  return ApiKeyButton;

})(Backbone.View);

this["Handlebars"]["templates"]["content_type"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.produces : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda;

  return "	<option value=\""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\">"
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "</option>\n";
},"4":function(depth0,helpers,partials,data) {
    return "  <option value=\"application/json\">application/json</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<label for=\"contentType\"></label>\n<select name=\"contentType\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.produces : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "</select>\n";
},"useData":true});
var BasicAuthButton,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BasicAuthButton = (function(superClass) {
  extend(BasicAuthButton, superClass);

  function BasicAuthButton() {
    return BasicAuthButton.__super__.constructor.apply(this, arguments);
  }

  BasicAuthButton.prototype.initialize = function() {};

  BasicAuthButton.prototype.render = function() {
    var template;
    template = this.template();
    jQuery(this.el).html(template(this.model));
    return this;
  };

  BasicAuthButton.prototype.events = {
    "click #basic_auth_button": "togglePasswordContainer",
    "click #apply_basic_auth": "applyPassword"
  };

  BasicAuthButton.prototype.applyPassword = function() {
    var elem, password, username;
    username = jQuery(".input_username").val();
    password = jQuery(".input_password").val();
    window.authorizations.add(this.model.type, new PasswordAuthorization("basic", username, password));
    window.swaggerUi.load();
    return elem = jQuery('#basic_auth_container').hide();
  };

  BasicAuthButton.prototype.togglePasswordContainer = function() {
    var elem;
    if (jQuery('#basic_auth_container').length > 0) {
      elem = jQuery('#basic_auth_container').show();
      if (elem.is(':visible')) {
        return elem.slideUp();
      } else {
        jQuery('.auth_container').hide();
        return elem.show();
      }
    }
  };

  BasicAuthButton.prototype.template = function() {
    return Handlebars.templates.basic_auth_button_view;
  };

  return BasicAuthButton;

})(Backbone.View);

this["Handlebars"]["templates"]["main"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda;

  return "  <div class=\"info_title\">"
    + this.escapeExpression(alias1(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.title : stack1), depth0))
    + "</div>\n  <div class=\"info_description markdown\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.description : stack1), depth0)) != null ? stack1 : "")
    + "</div>\n  "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.termsOfServiceUrl : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n  "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n  "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.url : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n  "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n  "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.license : stack1),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"info_tos\"><a href=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.termsOfServiceUrl : stack1), depth0))
    + "\">Terms of service</a></div>";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class='info_name'>Created by "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</div>";
},"6":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class='info_url'>See more at <a href=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.url : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.url : stack1), depth0))
    + "</a></div>";
},"8":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class='info_email'><a href=\"mailto:"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "?subject="
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.title : stack1), depth0))
    + "\">Contact the developer</a></div>";
},"10":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class='info_license'><a href='"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.license : stack1)) != null ? stack1.url : stack1), depth0))
    + "'>"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.license : stack1)) != null ? stack1.name : stack1), depth0))
    + "</a></div>";
},"12":function(depth0,helpers,partials,data) {
    var stack1;

  return "    , <span style=\"font-variant: small-caps\">api version</span>: "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.version : stack1), depth0))
    + "\n    ";
},"14":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <span style=\"float:right\"><a href=\""
    + alias3(((helper = (helper = helpers.validatorUrl || (depth0 != null ? depth0.validatorUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"validatorUrl","hash":{},"data":data}) : helper)))
    + "/debug?url="
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "\"><img id=\"validator\" src=\""
    + alias3(((helper = (helper = helpers.validatorUrl || (depth0 != null ? depth0.validatorUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"validatorUrl","hash":{},"data":data}) : helper)))
    + "?url="
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "\"></a>\n    </span>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class='info' id='api_info'>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.info : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n<div class='container' id='resources_container'>\n  <ul id='resources'></ul>\n\n  <div class=\"footer\">\n    <br>\n    <br>\n    <h4 style=\"color: #999\">[ <span style=\"font-variant: small-caps\">base url</span>: "
    + this.escapeExpression(((helper = (helper = helpers.basePath || (depth0 != null ? depth0.basePath : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"basePath","hash":{},"data":data}) : helper)))
    + "\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.version : stack1),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "]\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.validatorUrl : depth0),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </h4>\n    </div>\n</div>\n";
},"useData":true});
var ContentTypeView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ContentTypeView = (function(superClass) {
  extend(ContentTypeView, superClass);

  function ContentTypeView() {
    return ContentTypeView.__super__.constructor.apply(this, arguments);
  }

  ContentTypeView.prototype.initialize = function() {};

  ContentTypeView.prototype.render = function() {
    var template;
    template = this.template();
    jQuery(this.el).html(template(this.model));
    jQuery('label[for=contentType]', jQuery(this.el)).text('Response Content Type');
    return this;
  };

  ContentTypeView.prototype.template = function() {
    return Handlebars.templates.content_type;
  };

  return ContentTypeView;

})(Backbone.View);

this["Handlebars"]["templates"]["operation"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "deprecated";
},"3":function(depth0,helpers,partials,data) {
    return "            <h4>Warning: Deprecated</h4>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "        <h4>Implementation Notes</h4>\n        <p class=\"markdown\">"
    + ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p>\n";
},"7":function(depth0,helpers,partials,data) {
    return "        <div class=\"auth\">\n        <span class=\"api-ic ic-error\"></span>";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <div id=\"api_information_panel\" style=\"top: 526px; left: 776px; display: none;\">\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "          </div>\n";
},"10":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda;

  return "            <div title='"
    + ((stack1 = alias1((depth0 != null ? depth0.description : depth0), depth0)) != null ? stack1 : "")
    + "'>"
    + this.escapeExpression(alias1((depth0 != null ? depth0.scope : depth0), depth0))
    + "</div>\n";
},"12":function(depth0,helpers,partials,data) {
    return "</div>";
},"14":function(depth0,helpers,partials,data) {
    return "        <div class='access'>\n          <span class=\"api-ic ic-off\" title=\"click to authenticate\"></span>\n        </div>\n";
},"16":function(depth0,helpers,partials,data) {
    var helper;

  return "          <h4>Response Class (Status "
    + this.escapeExpression(((helper = (helper = helpers.successCode || (depth0 != null ? depth0.successCode : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"successCode","hash":{},"data":data}) : helper)))
    + ")</h4>\n          <p><span class=\"model-signature\" /></p>\n          <br/>\n          <div class=\"response-content-type\" />\n";
},"18":function(depth0,helpers,partials,data) {
    return "          <h4>Parameters</h4>\n          <table class='fullwidth'>\n          <thead>\n            <tr>\n            <th style=\"width: 100px; max-width: 100px\">Parameter</th>\n            <th style=\"width: 310px; max-width: 310px\">Value</th>\n            <th style=\"width: 200px; max-width: 200px\">Description</th>\n            <th style=\"width: 100px; max-width: 100px\">Parameter Type</th>\n            <th style=\"width: 220px; max-width: 230px\">Data Type</th>\n            </tr>\n          </thead>\n          <tbody class=\"operation-params\">\n\n          </tbody>\n          </table>\n";
},"20":function(depth0,helpers,partials,data) {
    return "          <div style='margin:0;padding:0;display:inline'></div>\n          <h4>Response Messages</h4>\n          <table class='fullwidth'>\n            <thead>\n            <tr>\n              <th>HTTP Status Code</th>\n              <th>Reason</th>\n              <th>Response Model</th>\n            </tr>\n            </thead>\n            <tbody class=\"operation-status\">\n            \n            </tbody>\n          </table>\n";
},"22":function(depth0,helpers,partials,data) {
    return "";
},"24":function(depth0,helpers,partials,data) {
    return "          <div class='sandbox_header'>\n            <input class='submit' name='commit' type='button' value='Try it out!' />\n            <a href='#' class='response_hider' style='display:none'>Hide Response</a>\n            <span class='response_throbber' style='display:none'></span>\n          </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=helpers.blockHelperMissing, buffer = 
  "\n  <ul class='operations' >\n    <li class='"
    + alias3(((helper = (helper = helpers.method || (depth0 != null ? depth0.method : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"method","hash":{},"data":data}) : helper)))
    + " operation' id='"
    + alias3(((helper = (helper = helpers.parentId || (depth0 != null ? depth0.parentId : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"parentId","hash":{},"data":data}) : helper)))
    + "_"
    + alias3(((helper = (helper = helpers.nickname || (depth0 != null ? depth0.nickname : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"nickname","hash":{},"data":data}) : helper)))
    + "'>\n      <div class='heading'>\n        <h3>\n          <span class='http_method'>\n          <a href='#!/"
    + alias3(((helper = (helper = helpers.parentId || (depth0 != null ? depth0.parentId : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"parentId","hash":{},"data":data}) : helper)))
    + "/"
    + alias3(((helper = (helper = helpers.nickname || (depth0 != null ? depth0.nickname : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"nickname","hash":{},"data":data}) : helper)))
    + "' class=\"toggleOperation\">"
    + alias3(((helper = (helper = helpers.method || (depth0 != null ? depth0.method : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"method","hash":{},"data":data}) : helper)))
    + "</a>\n          </span>\n          <span class='path'>\n          <a href='#!/"
    + alias3(((helper = (helper = helpers.parentId || (depth0 != null ? depth0.parentId : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"parentId","hash":{},"data":data}) : helper)))
    + "/"
    + alias3(((helper = (helper = helpers.nickname || (depth0 != null ? depth0.nickname : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"nickname","hash":{},"data":data}) : helper)))
    + "' class=\"toggleOperation "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.deprecated : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">"
    + alias3(((helper = (helper = helpers.path || (depth0 != null ? depth0.path : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"path","hash":{},"data":data}) : helper)))
    + "</a>\n          </span>\n        </h3>\n        <ul class='options'>\n          <li>\n          <a href='#!/"
    + alias3(((helper = (helper = helpers.parentId || (depth0 != null ? depth0.parentId : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"parentId","hash":{},"data":data}) : helper)))
    + "/"
    + alias3(((helper = (helper = helpers.nickname || (depth0 != null ? depth0.nickname : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"nickname","hash":{},"data":data}) : helper)))
    + "' class=\"toggleOperation\">"
    + ((stack1 = ((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"summary","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\n          </li>\n        </ul>\n      </div>\n      <div class='content' id='"
    + alias3(((helper = (helper = helpers.parentId || (depth0 != null ? depth0.parentId : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"parentId","hash":{},"data":data}) : helper)))
    + "_"
    + alias3(((helper = (helper = helpers.nickname || (depth0 != null ? depth0.nickname : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"nickname","hash":{},"data":data}) : helper)))
    + "_content' style='display:none'>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.deprecated : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
  stack1 = ((helper = (helper = helpers.oauth || (depth0 != null ? depth0.oauth : depth0)) != null ? helper : alias1),(options={"name":"oauth","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.oauth) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.oauth : depth0),{"name":"each","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        ";
  stack1 = ((helper = (helper = helpers.oauth || (depth0 != null ? depth0.oauth : depth0)) != null ? helper : alias1),(options={"name":"oauth","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.oauth) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n";
  stack1 = ((helper = (helper = helpers.oauth || (depth0 != null ? depth0.oauth : depth0)) != null ? helper : alias1),(options={"name":"oauth","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop,"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.oauth) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.type : depth0),{"name":"if","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <form accept-charset='UTF-8' class='sandbox'>\n          <div style='margin:0;padding:0;display:inline'></div>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.parameters : depth0),{"name":"if","hash":{},"fn":this.program(18, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.responseMessages : depth0),{"name":"if","hash":{},"fn":this.program(20, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isReadOnly : depth0),{"name":"if","hash":{},"fn":this.program(22, data, 0),"inverse":this.program(24, data, 0),"data":data})) != null ? stack1 : "")
    + "        </form>\n        <div class='response' style='display:none'>\n          <h4>Request URL</h4>\n          <div class='block request_url'></div>\n          <h4>Response Body</h4>\n          <div class='block response_body'></div>\n          <h4>Response Code</h4>\n          <div class='block response_code'></div>\n          <h4>Response Headers</h4>\n          <div class='block response_headers'></div>\n        </div>\n      </div>\n    </li>\n  </ul>\n";
},"useData":true});
var HeaderView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

HeaderView = (function(superClass) {
  extend(HeaderView, superClass);

  function HeaderView() {
    return HeaderView.__super__.constructor.apply(this, arguments);
  }

  HeaderView.prototype.events = {
    'click #show-pet-store-icon': 'showPetStore',
    'click #show-wordnik-dev-icon': 'showWordnikDev',
    'click #explore': 'showCustom',
    'keyup #input_baseUrl': 'showCustomOnKeyup',
    'keyup #input_apiKey': 'showCustomOnKeyup'
  };

  HeaderView.prototype.initialize = function() {};

  HeaderView.prototype.showPetStore = function(e) {
    return this.trigger('update-swagger-ui', {
      url: "http://petstore.swagger.wordnik.com/api/api-docs"
    });
  };

  HeaderView.prototype.showWordnikDev = function(e) {
    return this.trigger('update-swagger-ui', {
      url: "http://api.wordnik.com/v4/resources.json"
    });
  };

  HeaderView.prototype.showCustomOnKeyup = function(e) {
    if (e.keyCode === 13) {
      return this.showCustom();
    }
  };

  HeaderView.prototype.showCustom = function(e) {
    if (e != null) {
      e.preventDefault();
    }
    return this.trigger('update-swagger-ui', {
      url: jQuery('#input_baseUrl').val(),
      apiKey: jQuery('#input_apiKey').val()
    });
  };

  HeaderView.prototype.update = function(url, apiKey, trigger) {
    if (trigger == null) {
      trigger = false;
    }
    jQuery('#input_baseUrl').val(url);
    if (trigger) {
      return this.trigger('update-swagger-ui', {
        url: url
      });
    }
  };

  return HeaderView;

})(Backbone.View);

this["Handlebars"]["templates"]["param"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isFile : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var helper;

  return "			<input type=\"file\" name='"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "'/>\n			<div class=\"parameter-content-type\" />\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0['default'] : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "");
},"5":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "				<textarea class='body-textarea' name='"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "'>"
    + alias3(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"default","hash":{},"data":data}) : helper)))
    + "</textarea>\n        <br />\n        <div class=\"parameter-content-type\" />\n";
},"7":function(depth0,helpers,partials,data) {
    var helper;

  return "				<textarea class='body-textarea' name='"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "'></textarea>\n				<br />\n				<div class=\"parameter-content-type\" />\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isFile : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(10, data, 0),"data":data})) != null ? stack1 : "");
},"10":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0['default'] : depth0),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.program(13, data, 0),"data":data})) != null ? stack1 : "");
},"11":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "				<input class='parameter' minlength='0' name='"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "' placeholder='' type='text' value='"
    + alias3(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"default","hash":{},"data":data}) : helper)))
    + "'/>\n";
},"13":function(depth0,helpers,partials,data) {
    var helper;

  return "				<input class='parameter' minlength='0' name='"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "' placeholder='' type='text' value=''/>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "<td class='code'>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n<td>\n\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isBody : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "\n</td>\n<td class=\"markdown\">"
    + ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</td>\n<td>"
    + ((stack1 = ((helper = (helper = helpers.paramType || (depth0 != null ? depth0.paramType : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"paramType","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</td>\n<td>\n	<span class=\"model-signature\"></span>\n</td>\n";
},"useData":true});
var MainView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

MainView = (function(superClass) {
  var sorters;

  extend(MainView, superClass);

  function MainView() {
    return MainView.__super__.constructor.apply(this, arguments);
  }

  sorters = {
    'alpha': function(a, b) {
      return a.path.localeCompare(b.path);
    },
    'method': function(a, b) {
      return a.method.localeCompare(b.method);
    }
  };

  MainView.prototype.initialize = function(opts) {
    var auth, key, ref, value;
    if (opts == null) {
      opts = {};
    }
    this.model.auths = [];
    ref = this.model.securityDefinitions;
    for (key in ref) {
      value = ref[key];
      auth = {
        name: key,
        type: value.type,
        value: value
      };
      this.model.auths.push(auth);
    }
    if (this.model.swaggerVersion === "2.0") {
      if ("validatorUrl" in opts.swaggerOptions) {
        return this.model.validatorUrl = opts.swaggerOptions.validatorUrl;
      } else if (this.model.url.indexOf("localhost") > 0) {
        return this.model.validatorUrl = null;
      } else {
        return this.model.validatorUrl = "http://online.swagger.io/validator";
      }
    }
  };

  MainView.prototype.render = function() {
    var auth, button, counter, i, id, len, name, ref, resource, resources;
    if (this.model.securityDefinitions) {
      for (name in this.model.securityDefinitions) {
        auth = this.model.securityDefinitions[name];
        if (auth.type === "apiKey" && jQuery("#apikey_button").length === 0) {
          button = new ApiKeyButton({
            model: auth
          }).render().el;
          jQuery('.auth_main_container').append(button);
        }
        if (auth.type === "basicAuth" && jQuery("#basic_auth_button").length === 0) {
          button = new BasicAuthButton({
            model: auth
          }).render().el;
          jQuery('.auth_main_container').append(button);
        }
      }
    }
    jQuery(this.el).html(Handlebars.templates.main(this.model));
    resources = {};
    counter = 0;
    ref = this.model.apisArray;
    for (i = 0, len = ref.length; i < len; i++) {
      resource = ref[i];
      id = resource.name;
      while (typeof resources[id] !== 'undefined') {
        id = id + "_" + counter;
        counter += 1;
      }
      resource.id = id;
      resources[id] = resource;
      this.addResource(resource, this.model.auths);
    }
    jQuery('.propWrap').hover(function() {
      return jQuery('.optionsWrapper', jQuery(this)).show();
    }, function() {
      return jQuery('.optionsWrapper', jQuery(this)).hide();
    });
    return this;
  };

  MainView.prototype.addResource = function(resource, auths) {
    var resourceView;
    resource.id = resource.id.replace(/\s/g, '_');
    resourceView = new ResourceView({
      model: resource,
      tagName: 'li',
      id: 'resource_' + resource.id,
      className: 'resource',
      auths: auths,
      swaggerOptions: this.options.swaggerOptions
    });
    return jQuery('#resources').append(resourceView.render().el);
  };

  MainView.prototype.clear = function() {
    return jQuery(this.el).html('');
  };

  return MainView;

})(Backbone.View);

this["Handlebars"]["templates"]["param_list"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " multiple='multiple'";
},"3":function(depth0,helpers,partials,data) {
    return "";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0['default'] : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "");
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.isArray || (depth0 && depth0.isArray) || helpers.helperMissing).call(depth0,depth0,{"name":"isArray","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "");
},"7":function(depth0,helpers,partials,data) {
    return "          <option selected=\"\" value=''></option>\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isDefault : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.program(12, data, 0),"data":data})) != null ? stack1 : "");
},"10":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <option selected=\"\" value='"
    + alias3(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"value","hash":{},"data":data}) : helper)))
    + "'>"
    + alias3(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"value","hash":{},"data":data}) : helper)))
    + " (default)</option>\n";
},"12":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <option value='"
    + alias3(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"value","hash":{},"data":data}) : helper)))
    + "'>"
    + alias3(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"value","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<td class='code'>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n<td>\n  <select "
    + ((stack1 = (helpers.isArray || (depth0 && depth0.isArray) || alias1).call(depth0,depth0,{"name":"isArray","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " class='parameter' name='"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "'>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.required : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.allowableValues : depth0)) != null ? stack1.descriptiveValues : stack1),{"name":"each","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </select>\n</td>\n<td class=\"markdown\">"
    + ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</td>\n<td>"
    + ((stack1 = ((helper = (helper = helpers.paramType || (depth0 != null ? depth0.paramType : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"paramType","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</td>\n<td><span class=\"model-signature\"></span></td>";
},"useData":true});
var OperationView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

OperationView = (function(superClass) {
  extend(OperationView, superClass);

  function OperationView() {
    return OperationView.__super__.constructor.apply(this, arguments);
  }

  OperationView.prototype.invocationUrl = null;

  OperationView.prototype.events = {
    'submit .sandbox': 'submitOperation',
    'click .submit': 'submitOperation',
    'click .response_hider': 'hideResponse',
    'click .toggleOperation': 'toggleOperationContent',
    'mouseenter .api-ic': 'mouseEnter',
    'mouseout .api-ic': 'mouseExit'
  };

  OperationView.prototype.initialize = function(opts) {
    if (opts == null) {
      opts = {};
    }
    this.auths = opts.auths;
    this.parentId = this.model.parentId;
    this.nickname = this.model.nickname;
    return this;
  };

  OperationView.prototype.mouseEnter = function(e) {
    var elem, hgh, pos, scMaxX, scMaxY, scX, scY, wd, x, y;
    elem = jQuery(this.el).find('.content');
    x = e.pageX;
    y = e.pageY;
    scX = jQuery(window).scrollLeft();
    scY = jQuery(window).scrollTop();
    scMaxX = scX + jQuery(window).width();
    scMaxY = scY + jQuery(window).height();
    wd = elem.width();
    hgh = elem.height();
    if (x + wd > scMaxX) {
      x = scMaxX - wd;
    }
    if (x < scX) {
      x = scX;
    }
    if (y + hgh > scMaxY) {
      y = scMaxY - hgh;
    }
    if (y < scY) {
      y = scY;
    }
    pos = {};
    pos.top = y;
    pos.left = x;
    elem.css(pos);
    return jQuery(e.currentTarget.parentNode).find('#api_information_panel').show();
  };

  OperationView.prototype.mouseExit = function(e) {
    return jQuery(e.currentTarget.parentNode).find('#api_information_panel').hide();
  };

  OperationView.prototype.render = function() {
    var a, auth, auths, code, contentTypeModel, isMethodSubmissionSupported, k, key, l, len, len1, len2, len3, len4, m, modelAuths, n, o, p, param, q, ref, ref1, ref2, ref3, ref4, ref5, responseContentTypeView, responseSignatureView, schema, schemaObj, scopeIndex, signatureModel, statusCode, successResponse, type, v, value;
    isMethodSubmissionSupported = jQuery.inArray(this.model.method, this.model.supportedSubmitMethods()) >= 0;
    if (!isMethodSubmissionSupported) {
      this.model.isReadOnly = true;
    }
    this.model.description = this.model.description || this.model.notes;
    if (this.model.description) {
      this.model.description = this.model.description.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
    this.model.oauth = null;
    modelAuths = this.model.authorizations || this.model.security;
    if (modelAuths) {
      if (Array.isArray(modelAuths)) {
        for (l = 0, len = modelAuths.length; l < len; l++) {
          auths = modelAuths[l];
          for (key in auths) {
            auth = auths[key];
            for (a in this.auths) {
              auth = this.auths[a];
              if (auth.type === 'oauth2') {
                this.model.oauth = {};
                this.model.oauth.scopes = [];
                ref1 = auth.value.scopes;
                for (k in ref1) {
                  v = ref1[k];
                  scopeIndex = auths[key].indexOf(k);
                  if (scopeIndex >= 0) {
                    o = {
                      scope: k,
                      description: v
                    };
                    this.model.oauth.scopes.push(o);
                  }
                }
              }
            }
          }
        }
      } else {
        for (k in modelAuths) {
          v = modelAuths[k];
          if (k === "oauth2") {
            if (this.model.oauth === null) {
              this.model.oauth = {};
            }
            if (this.model.oauth.scopes === void 0) {
              this.model.oauth.scopes = [];
            }
            for (m = 0, len1 = v.length; m < len1; m++) {
              o = v[m];
              this.model.oauth.scopes.push(o);
            }
          }
        }
      }
    }
    if (typeof this.model.responses !== 'undefined') {
      this.model.responseMessages = [];
      ref2 = this.model.responses;
      for (code in ref2) {
        value = ref2[code];
        schema = null;
        schemaObj = this.model.responses[code].schema;
        if (schemaObj && schemaObj['$ref']) {
          schema = schemaObj['$ref'];
          if (schema.indexOf('#/definitions/') === 0) {
            schema = schema.substring('#/definitions/'.length);
          }
        }
        this.model.responseMessages.push({
          code: code,
          message: value.description,
          responseModel: schema
        });
      }
    }
    if (typeof this.model.responseMessages === 'undefined') {
      this.model.responseMessages = [];
    }
    signatureModel = null;
    if (this.model.successResponse) {
      successResponse = this.model.successResponse;
      for (key in successResponse) {
        value = successResponse[key];
        this.model.successCode = key;
        if (typeof value === 'object' && typeof value.createJSONSample === 'function') {
          signatureModel = {
            sampleJSON: JSON.stringify(value.createJSONSample(), void 0, 2),
            isParam: false,
            signature: value.getMockSignature()
          };
        }
      }
    } else if (this.model.responseClassSignature && this.model.responseClassSignature !== 'string') {
      signatureModel = {
        sampleJSON: this.model.responseSampleJSON,
        isParam: false,
        signature: this.model.responseClassSignature
      };
    }
    jQuery(this.el).html(Handlebars.templates.operation(this.model));
    if (signatureModel) {
      responseSignatureView = new SignatureView({
        model: signatureModel,
        tagName: 'div'
      });
      jQuery('.model-signature', jQuery(this.el)).append(responseSignatureView.render().el);
    } else {
      this.model.responseClassSignature = 'string';
      jQuery('.model-signature', jQuery(this.el)).html(this.model.type);
    }
    contentTypeModel = {
      isParam: false
    };
    contentTypeModel.consumes = this.model.consumes;
    contentTypeModel.produces = this.model.produces;
    ref3 = this.model.parameters;
    for (n = 0, len2 = ref3.length; n < len2; n++) {
      param = ref3[n];
      type = param.type || param.dataType || '';
      if (typeof type === 'undefined') {
        schema = param.schema;
        if (schema && schema['$ref']) {
          ref = schema['$ref'];
          if (ref.indexOf('#/definitions/') === 0) {
            type = ref.substring('#/definitions/'.length);
          } else {
            type = ref;
          }
        }
      }
      if (type && type.toLowerCase() === 'file') {
        if (!contentTypeModel.consumes) {
          contentTypeModel.consumes = 'multipart/form-data';
        }
      }
      param.type = type;
    }
    responseContentTypeView = new ResponseContentTypeView({
      model: contentTypeModel
    });
    jQuery('.response-content-type', jQuery(this.el)).append(responseContentTypeView.render().el);
    ref4 = this.model.parameters;
    for (p = 0, len3 = ref4.length; p < len3; p++) {
      param = ref4[p];
      this.addParameter(param, contentTypeModel.consumes);
    }
    ref5 = this.model.responseMessages;
    for (q = 0, len4 = ref5.length; q < len4; q++) {
      statusCode = ref5[q];
      this.addStatusCode(statusCode);
    }
    return this;
  };

  OperationView.prototype.addParameter = function(param, consumes) {
    var paramView;
    param.consumes = consumes;
    paramView = new ParameterView({
      model: param,
      tagName: 'tr',
      readOnly: this.model.isReadOnly
    });
    return jQuery('.operation-params', jQuery(this.el)).append(paramView.render().el);
  };

  OperationView.prototype.addStatusCode = function(statusCode) {
    var statusCodeView;
    statusCodeView = new StatusCodeView({
      model: statusCode,
      tagName: 'tr'
    });
    return jQuery('.operation-status', jQuery(this.el)).append(statusCodeView.render().el);
  };

  OperationView.prototype.submitOperation = function(e) {
    var error_free, form, isFileUpload, l, len, len1, len2, m, map, n, o, opts, ref1, ref2, ref3, val;
    if (e != null) {
      e.preventDefault();
    }
    form = jQuery('.sandbox', jQuery(this.el));
    error_free = true;
    form.find("input.required").each(function() {
      jQuery(this).removeClass("error");
      if (jQuery.trim(jQuery(this).val()) === "") {
        jQuery(this).addClass("error");
        jQuery(this).wiggle({
          callback: (function(_this) {
            return function() {
              return jQuery(_this).focus();
            };
          })(this)
        });
        return error_free = false;
      }
    });
    form.find("textarea.required").each(function() {
      jQuery(this).removeClass("error");
      if (jQuery.trim(jQuery(this).val()) === "") {
        jQuery(this).addClass("error");
        jQuery(this).wiggle({
          callback: (function(_this) {
            return function() {
              return jQuery(_this).focus();
            };
          })(this)
        });
        return error_free = false;
      }
    });
    if (error_free) {
      map = {};
      opts = {
        parent: this
      };
      isFileUpload = false;
      ref1 = form.find("input");
      for (l = 0, len = ref1.length; l < len; l++) {
        o = ref1[l];
        if ((o.value != null) && jQuery.trim(o.value).length > 0) {
          map[o.name] = o.value;
        }
        if (o.type === "file") {
          map[o.name] = o.files[0];
          isFileUpload = true;
        }
      }
      ref2 = form.find("textarea");
      for (m = 0, len1 = ref2.length; m < len1; m++) {
        o = ref2[m];
        if ((o.value != null) && jQuery.trim(o.value).length > 0) {
          map[o.name] = o.value;
        }
      }
      ref3 = form.find("select");
      for (n = 0, len2 = ref3.length; n < len2; n++) {
        o = ref3[n];
        val = this.getSelectedValue(o);
        if ((val != null) && jQuery.trim(val).length > 0) {
          map[o.name] = val;
        }
      }
      opts.responseContentType = jQuery("div select[name=responseContentType]", jQuery(this.el)).val();
      opts.requestContentType = jQuery("div select[name=parameterContentType]", jQuery(this.el)).val();
      jQuery(".response_throbber", jQuery(this.el)).show();
      if (isFileUpload) {
        return this.handleFileUpload(map, form);
      } else {
        return this.model["do"](map, opts, this.showCompleteStatus, this.showErrorStatus, this);
      }
    }
  };

  OperationView.prototype.success = function(response, parent) {
    return parent.showCompleteStatus(response);
  };

  OperationView.prototype.handleFileUpload = function(map, form) {
    var bodyParam, el, headerParams, l, len, len1, len2, len3, m, n, o, obj, p, param, params, ref1, ref2, ref3, ref4;
    ref1 = form.serializeArray();
    for (l = 0, len = ref1.length; l < len; l++) {
      o = ref1[l];
      if ((o.value != null) && jQuery.trim(o.value).length > 0) {
        map[o.name] = o.value;
      }
    }
    bodyParam = new FormData();
    params = 0;
    ref2 = this.model.parameters;
    for (m = 0, len1 = ref2.length; m < len1; m++) {
      param = ref2[m];
      if (param.paramType === 'form' || param["in"] === 'formData') {
        if (param.type.toLowerCase() !== 'file' && map[param.name] !== void 0) {
          bodyParam.append(param.name, map[param.name]);
        }
      }
    }
    headerParams = {};
    ref3 = this.model.parameters;
    for (n = 0, len2 = ref3.length; n < len2; n++) {
      param = ref3[n];
      if (param.paramType === 'header') {
        headerParams[param.name] = map[param.name];
      }
    }
    ref4 = form.find('input[type~="file"]');
    for (p = 0, len3 = ref4.length; p < len3; p++) {
      el = ref4[p];
      if (typeof el.files[0] !== 'undefined') {
        bodyParam.append(jQuery(el).attr('name'), el.files[0]);
        params += 1;
      }
    }
    this.invocationUrl = this.model.supportHeaderParams() ? (headerParams = this.model.getHeaderParams(map), delete headerParams['Content-Type'], this.model.urlify(map, false)) : this.model.urlify(map, true);
    jQuery(".request_url", jQuery(this.el)).html("<pre></pre>");
    jQuery(".request_url pre", jQuery(this.el)).text(this.invocationUrl);
    obj = {
      type: this.model.method,
      url: this.invocationUrl,
      headers: headerParams,
      data: bodyParam,
      dataType: 'json',
      contentType: false,
      processData: false,
      error: (function(_this) {
        return function(data, textStatus, error) {
          return _this.showErrorStatus(_this.wrap(data), _this);
        };
      })(this),
      success: (function(_this) {
        return function(data) {
          return _this.showResponse(data, _this);
        };
      })(this),
      complete: (function(_this) {
        return function(data) {
          return _this.showCompleteStatus(_this.wrap(data), _this);
        };
      })(this)
    };
    if (window.authorizations) {
      window.authorizations.apply(obj);
    }
    if (params === 0) {
      obj.data.append("fake", "true");
    }
    jQuery.ajax(obj);
    return false;
  };

  OperationView.prototype.wrap = function(data) {
    var h, headerArray, headers, i, l, len, o;
    headers = {};
    headerArray = data.getAllResponseHeaders().split("\r");
    for (l = 0, len = headerArray.length; l < len; l++) {
      i = headerArray[l];
      h = i.match(/^([^:]*?):(.*)$/);
      if (!h) {
        h = [];
      }
      h.shift();
      if (h[0] !== void 0 && h[1] !== void 0) {
        headers[h[0].trim()] = h[1].trim();
      }
    }
    o = {};
    o.content = {};
    o.content.data = data.responseText;
    o.headers = headers;
    o.request = {};
    o.request.url = this.invocationUrl;
    o.status = data.status;
    return o;
  };

  OperationView.prototype.getSelectedValue = function(select) {
    var l, len, opt, options, ref1;
    if (!select.multiple) {
      return select.value;
    } else {
      options = [];
      ref1 = select.options;
      for (l = 0, len = ref1.length; l < len; l++) {
        opt = ref1[l];
        if (opt.selected) {
          options.push(opt.value);
        }
      }
      if (options.length > 0) {
        return options;
      } else {
        return null;
      }
    }
  };

  OperationView.prototype.hideResponse = function(e) {
    if (e != null) {
      e.preventDefault();
    }
    jQuery(".response", jQuery(this.el)).slideUp();
    return jQuery(".response_hider", jQuery(this.el)).fadeOut();
  };

  OperationView.prototype.showResponse = function(response) {
    var prettyJson;
    prettyJson = JSON.stringify(response, null, "\t").replace(/\n/g, "<br>");
    return jQuery(".response_body", jQuery(this.el)).html(escape(prettyJson));
  };

  OperationView.prototype.showErrorStatus = function(data, parent) {
    return parent.showStatus(data);
  };

  OperationView.prototype.showCompleteStatus = function(data, parent) {
    return parent.showStatus(data);
  };

  OperationView.prototype.formatXml = function(xml) {
    var contexp, fn, formatted, indent, l, lastType, len, lines, ln, pad, reg, transitions, wsexp;
    reg = /(>)(<)(\/*)/g;
    wsexp = /[ ]*(.*)[ ]+\n/g;
    contexp = /(<.+>)(.+\n)/g;
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    pad = 0;
    formatted = '';
    lines = xml.split('\n');
    indent = 0;
    lastType = 'other';
    transitions = {
      'single->single': 0,
      'single->closing': -1,
      'single->opening': 0,
      'single->other': 0,
      'closing->single': 0,
      'closing->closing': -1,
      'closing->opening': 0,
      'closing->other': 0,
      'opening->single': 1,
      'opening->closing': 0,
      'opening->opening': 1,
      'opening->other': 1,
      'other->single': 0,
      'other->closing': -1,
      'other->opening': 0,
      'other->other': 0
    };
    fn = function(ln) {
      var fromTo, j, key, padding, type, types, value;
      types = {
        single: Boolean(ln.match(/<.+\/>/)),
        closing: Boolean(ln.match(/<\/.+>/)),
        opening: Boolean(ln.match(/<[^!?].*>/))
      };
      type = ((function() {
        var results;
        results = [];
        for (key in types) {
          value = types[key];
          if (value) {
            results.push(key);
          }
        }
        return results;
      })())[0];
      type = type === void 0 ? 'other' : type;
      fromTo = lastType + '->' + type;
      lastType = type;
      padding = '';
      indent += transitions[fromTo];
      padding = ((function() {
        var m, ref1, results;
        results = [];
        for (j = m = 0, ref1 = indent; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
          results.push('  ');
        }
        return results;
      })()).join('');
      if (fromTo === 'opening->closing') {
        return formatted = formatted.substr(0, formatted.length - 1) + ln + '\n';
      } else {
        return formatted += padding + ln + '\n';
      }
    };
    for (l = 0, len = lines.length; l < len; l++) {
      ln = lines[l];
      fn(ln);
    }
    return formatted;
  };

  OperationView.prototype.showStatus = function(response) {
    var code, content, contentType, e, headers, json, opts, pre, response_body, response_body_el, url;
    if (response.content === void 0) {
      content = response.data;
      url = response.url;
    } else {
      content = response.content.data;
      url = response.request.url;
    }
    headers = response.headers;
    contentType = null;
    if (headers) {
      contentType = headers["Content-Type"] || headers["content-type"];
      if (contentType) {
        contentType = contentType.split(";")[0].trim();
      }
    }
    jQuery(".response_body", jQuery(this.el)).removeClass('json');
    jQuery(".response_body", jQuery(this.el)).removeClass('xml');
    if (!content) {
      code = jQuery('<code />').text("no content");
      pre = jQuery('<pre class="json" />').append(code);
    } else if (contentType === "application/json" || /\+json$/.test(contentType)) {
      json = null;
      try {
        json = JSON.stringify(JSON.parse(content), null, "  ");
      } catch (_error) {
        e = _error;
        json = "can't parse JSON.  Raw result:\n\n" + content;
      }
      code = jQuery('<code />').text(json);
      pre = jQuery('<pre class="json" />').append(code);
    } else if (contentType === "application/xml" || /\+xml$/.test(contentType)) {
      code = jQuery('<code />').text(this.formatXml(content));
      pre = jQuery('<pre class="xml" />').append(code);
    } else if (contentType === "text/html") {
      code = jQuery('<code />').html(_.escape(content));
      pre = jQuery('<pre class="xml" />').append(code);
    } else if (/^image\//.test(contentType)) {
      pre = jQuery('<img>').attr('src', url);
    } else {
      code = jQuery('<code />').text(content);
      pre = jQuery('<pre class="json" />').append(code);
    }
    response_body = pre;
    jQuery(".request_url", jQuery(this.el)).html("<pre></pre>");
    jQuery(".request_url pre", jQuery(this.el)).text(url);
    jQuery(".response_code", jQuery(this.el)).html("<pre>" + response.status + "</pre>");
    jQuery(".response_body", jQuery(this.el)).html(response_body);
    jQuery(".response_headers", jQuery(this.el)).html("<pre>" + _.escape(JSON.stringify(response.headers, null, "  ")).replace(/\n/g, "<br>") + "</pre>");
    jQuery(".response", jQuery(this.el)).slideDown();
    jQuery(".response_hider", jQuery(this.el)).show();
    jQuery(".response_throbber", jQuery(this.el)).hide();
    response_body_el = jQuery('.response_body', jQuery(this.el))[0];
    opts = this.options.swaggerOptions;
    if (opts.highlightSizeThreshold && response.data.length > opts.highlightSizeThreshold) {
      return response_body_el;
    } else {
      return hljs.highlightBlock(response_body_el);
    }
  };

  OperationView.prototype.toggleOperationContent = function() {
    var elem;
    elem = jQuery('#' + Docs.escapeResourceName(this.parentId + "_" + this.nickname + "_content"));
    if (elem.is(':visible')) {
      return Docs.collapseOperation(elem);
    } else {
      return Docs.expandOperation(elem);
    }
  };

  return OperationView;

})(Backbone.View);

this["Handlebars"]["templates"]["param_readonly"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <textarea class='body-textarea' readonly='readonly' name='"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "'>"
    + alias3(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"default","hash":{},"data":data}) : helper)))
    + "</textarea>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0['default'] : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "            "
    + this.escapeExpression(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"default","hash":{},"data":data}) : helper)))
    + "\n";
},"6":function(depth0,helpers,partials,data) {
    return "            (empty)\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "<td class='code'>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n<td>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isBody : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</td>\n<td class=\"markdown\">"
    + ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</td>\n<td>"
    + ((stack1 = ((helper = (helper = helpers.paramType || (depth0 != null ? depth0.paramType : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"paramType","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</td>\n<td><span class=\"model-signature\"></span></td>\n";
},"useData":true});
var ParameterContentTypeView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ParameterContentTypeView = (function(superClass) {
  extend(ParameterContentTypeView, superClass);

  function ParameterContentTypeView() {
    return ParameterContentTypeView.__super__.constructor.apply(this, arguments);
  }

  ParameterContentTypeView.prototype.initialize = function() {};

  ParameterContentTypeView.prototype.render = function() {
    var template;
    template = this.template();
    jQuery(this.el).html(template(this.model));
    jQuery('label[for=parameterContentType]', jQuery(this.el)).text('Parameter content type:');
    return this;
  };

  ParameterContentTypeView.prototype.template = function() {
    return Handlebars.templates.parameter_content_type;
  };

  return ParameterContentTypeView;

})(Backbone.View);

this["Handlebars"]["templates"]["param_readonly_required"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <textarea class='body-textarea'  readonly='readonly' placeholder='(required)' name='"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "'>"
    + alias3(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"default","hash":{},"data":data}) : helper)))
    + "</textarea>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0['default'] : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "            "
    + this.escapeExpression(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"default","hash":{},"data":data}) : helper)))
    + "\n";
},"6":function(depth0,helpers,partials,data) {
    return "            (empty)\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "<td class='code required'>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n<td>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isBody : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</td>\n<td class=\"markdown\">"
    + ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</td>\n<td>"
    + ((stack1 = ((helper = (helper = helpers.paramType || (depth0 != null ? depth0.paramType : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"paramType","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</td>\n<td><span class=\"model-signature\"></span></td>\n";
},"useData":true});
this["Handlebars"]["templates"]["param_required"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isFile : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var helper;

  return "			<input type=\"file\" name='"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "'/>\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0['default'] : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "");
},"5":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "				<textarea class='body-textarea required' placeholder='(required)' name='"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "'>"
    + alias3(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"default","hash":{},"data":data}) : helper)))
    + "</textarea>\n        <br />\n        <div class=\"parameter-content-type\" />\n";
},"7":function(depth0,helpers,partials,data) {
    var helper;

  return "				<textarea class='body-textarea required' placeholder='(required)' name='"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "'></textarea>\n				<br />\n				<div class=\"parameter-content-type\" />\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isFile : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.program(12, data, 0),"data":data})) != null ? stack1 : "");
},"10":function(depth0,helpers,partials,data) {
    var helper;

  return "			<input class='parameter' class='required' type='file' name='"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "'/>\n";
},"12":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0['default'] : depth0),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.program(15, data, 0),"data":data})) != null ? stack1 : "");
},"13":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "				<input class='parameter required' minlength='1' name='"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "' placeholder='(required)' type='text' value='"
    + alias3(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"default","hash":{},"data":data}) : helper)))
    + "'/>\n";
},"15":function(depth0,helpers,partials,data) {
    var helper;

  return "				<input class='parameter required' minlength='1' name='"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "' placeholder='(required)' type='text' value=''/>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "<td class='code required'>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n<td>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isBody : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "</td>\n<td>\n	<strong><span class=\"markdown\">"
    + ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span></strong>\n</td>\n<td>"
    + ((stack1 = ((helper = (helper = helpers.paramType || (depth0 != null ? depth0.paramType : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"paramType","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</td>\n<td><span class=\"model-signature\"></span></td>\n";
},"useData":true});
var ParameterView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ParameterView = (function(superClass) {
  extend(ParameterView, superClass);

  function ParameterView() {
    return ParameterView.__super__.constructor.apply(this, arguments);
  }

  ParameterView.prototype.initialize = function() {
    return Handlebars.registerHelper('isArray', function(param, opts) {
      if (param.type.toLowerCase() === 'array' || param.allowMultiple) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    });
  };

  ParameterView.prototype.render = function() {
    var contentTypeModel, isParam, parameterContentTypeView, ref, responseContentTypeView, schema, signatureModel, signatureView, template, type;
    type = this.model.type || this.model.dataType;
    if (typeof type === 'undefined') {
      schema = this.model.schema;
      if (schema && schema['$ref']) {
        ref = schema['$ref'];
        if (ref.indexOf('#/definitions/') === 0) {
          type = ref.substring('#/definitions/'.length);
        } else {
          type = ref;
        }
      }
    }
    this.model.type = type;
    this.model.paramType = this.model["in"] || this.model.paramType;
    if (this.model.paramType === 'body' || this.model["in"] === 'body') {
      this.model.isBody = true;
    }
    if (type && type.toLowerCase() === 'file') {
      this.model.isFile = true;
    }
    this.model["default"] = this.model["default"] || this.model.defaultValue;
    if (this.model.allowableValues) {
      this.model.isList = true;
    }
    template = this.template();
    jQuery(this.el).html(template(this.model));
    signatureModel = {
      sampleJSON: this.model.sampleJSON,
      isParam: true,
      signature: this.model.signature
    };
    if (this.model.sampleJSON) {
      signatureView = new SignatureView({
        model: signatureModel,
        tagName: 'div'
      });
      jQuery('.model-signature', jQuery(this.el)).append(signatureView.render().el);
    } else {
      jQuery('.model-signature', jQuery(this.el)).html(this.model.signature);
    }
    isParam = false;
    if (this.model.isBody) {
      isParam = true;
    }
    contentTypeModel = {
      isParam: isParam
    };
    contentTypeModel.consumes = this.model.consumes;
    if (isParam) {
      parameterContentTypeView = new ParameterContentTypeView({
        model: contentTypeModel
      });
      jQuery('.parameter-content-type', jQuery(this.el)).append(parameterContentTypeView.render().el);
    } else {
      responseContentTypeView = new ResponseContentTypeView({
        model: contentTypeModel
      });
      jQuery('.response-content-type', jQuery(this.el)).append(responseContentTypeView.render().el);
    }
    return this;
  };

  ParameterView.prototype.template = function() {
    if (this.model.isList) {
      return Handlebars.templates.param_list;
    } else {
      if (this.options.readOnly) {
        if (this.model.required) {
          return Handlebars.templates.param_readonly_required;
        } else {
          return Handlebars.templates.param_readonly;
        }
      } else {
        if (this.model.required) {
          return Handlebars.templates.param_required;
        } else {
          return Handlebars.templates.param;
        }
      }
    }
  };

  return ParameterView;

})(Backbone.View);

this["Handlebars"]["templates"]["parameter_content_type"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.consumes : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda;

  return "  <option value=\""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\">"
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "</option>\n";
},"4":function(depth0,helpers,partials,data) {
    return "  <option value=\"application/json\">application/json</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<label for=\"parameterContentType\"></label>\n<select name=\"parameterContentType\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.consumes : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "</select>\n";
},"useData":true});
var ResourceView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ResourceView = (function(superClass) {
  extend(ResourceView, superClass);

  function ResourceView() {
    return ResourceView.__super__.constructor.apply(this, arguments);
  }

  ResourceView.prototype.initialize = function(opts) {
    if (opts == null) {
      opts = {};
    }
    this.auths = opts.auths;
    if ("" === this.model.description) {
      this.model.description = null;
    }
    if (this.model.description != null) {
      return this.model.summary = this.model.description;
    }
  };

  ResourceView.prototype.render = function() {
    var counter, i, id, len, methods, operation, ref;
    methods = {};
    jQuery(this.el).html(Handlebars.templates.resource(this.model));
    ref = this.model.operationsArray;
    for (i = 0, len = ref.length; i < len; i++) {
      operation = ref[i];
      counter = 0;
      id = operation.nickname;
      while (typeof methods[id] !== 'undefined') {
        id = id + "_" + counter;
        counter += 1;
      }
      methods[id] = operation;
      operation.nickname = id;
      operation.parentId = this.model.id;
      this.addOperation(operation);
    }
    jQuery('.toggleEndpointList', this.el).click(this.callDocs.bind(this, 'toggleEndpointListForResource'));
    jQuery('.collapseResource', this.el).click(this.callDocs.bind(this, 'collapseOperationsForResource'));
    jQuery('.expandResource', this.el).click(this.callDocs.bind(this, 'expandOperationsForResource'));
    return this;
  };

  ResourceView.prototype.addOperation = function(operation) {
    var operationView;
    operation.number = this.number;
    operationView = new OperationView({
      model: operation,
      tagName: 'li',
      className: 'endpoint',
      swaggerOptions: this.options.swaggerOptions,
      auths: this.auths
    });
    jQuery('.endpoints', jQuery(this.el)).append(operationView.render().el);
    return this.number++;
  };

  ResourceView.prototype.callDocs = function(fnName, e) {
    e.preventDefault();
    return Docs[fnName](e.currentTarget.getAttribute('data-id'));
  };

  return ResourceView;

})(Backbone.View);

var ResponseContentTypeView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ResponseContentTypeView = (function(superClass) {
  extend(ResponseContentTypeView, superClass);

  function ResponseContentTypeView() {
    return ResponseContentTypeView.__super__.constructor.apply(this, arguments);
  }

  ResponseContentTypeView.prototype.initialize = function() {};

  ResponseContentTypeView.prototype.render = function() {
    var template;
    template = this.template();
    jQuery(this.el).html(template(this.model));
    jQuery('label[for=responseContentType]', jQuery(this.el)).text('Response Content Type');
    return this;
  };

  ResponseContentTypeView.prototype.template = function() {
    return Handlebars.templates.response_content_type;
  };

  return ResponseContentTypeView;

})(Backbone.View);

this["Handlebars"]["templates"]["resource"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " : ";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "<li>\n      <a href='"
    + this.escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "'>Raw</a>\n    </li>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=helpers.blockHelperMissing, buffer = 
  "<div class='heading'>\n  <h2>\n    <a href='#!/"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "' class=\"toggleEndpointList\" data-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a> ";
  stack1 = ((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : alias1),(options={"name":"summary","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.summary) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += ((stack1 = ((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"summary","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n  </h2>\n  <ul class='options'>\n    <li>\n      <a href='#!/"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "' id='endpointListTogger_"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "' class=\"toggleEndpointList\" data-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">Show/Hide</a>\n    </li>\n    <li>\n      <a href='#' class=\"collapseResource\" data-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n        List Operations\n      </a>\n    </li>\n    <li>\n      <a href='#' class=\"expandResource\" data-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n        Expand Operations\n      </a>\n    </li>\n    ";
  stack1 = ((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(options={"name":"url","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.url) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n  </ul>\n</div>\n<ul class='endpoints' id='"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "_endpoint_list' style='display:none'>\n\n</ul>\n";
},"useData":true});
var SignatureView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SignatureView = (function(superClass) {
  extend(SignatureView, superClass);

  function SignatureView() {
    return SignatureView.__super__.constructor.apply(this, arguments);
  }

  SignatureView.prototype.events = {
    'click a.description-link': 'switchToDescription',
    'click a.snippet-link': 'switchToSnippet',
    'mousedown .snippet': 'snippetToTextArea'
  };

  SignatureView.prototype.initialize = function() {};

  SignatureView.prototype.render = function() {
    var template;
    template = this.template();
    jQuery(this.el).html(template(this.model));
    this.switchToSnippet();
    this.isParam = this.model.isParam;
    if (this.isParam) {
      jQuery('.notice', jQuery(this.el)).text('Click to set as parameter value');
    }
    return this;
  };

  SignatureView.prototype.template = function() {
    return Handlebars.templates.signature;
  };

  SignatureView.prototype.switchToDescription = function(e) {
    if (e != null) {
      e.preventDefault();
    }
    jQuery(".snippet", jQuery(this.el)).hide();
    jQuery(".description", jQuery(this.el)).show();
    jQuery('.description-link', jQuery(this.el)).addClass('selected');
    return jQuery('.snippet-link', jQuery(this.el)).removeClass('selected');
  };

  SignatureView.prototype.switchToSnippet = function(e) {
    if (e != null) {
      e.preventDefault();
    }
    jQuery(".description", jQuery(this.el)).hide();
    jQuery(".snippet", jQuery(this.el)).show();
    jQuery('.snippet-link', jQuery(this.el)).addClass('selected');
    return jQuery('.description-link', jQuery(this.el)).removeClass('selected');
  };

  SignatureView.prototype.snippetToTextArea = function(e) {
    var textArea;
    if (this.isParam) {
      if (e != null) {
        e.preventDefault();
      }
      textArea = jQuery('textarea', jQuery(this.el.parentNode.parentNode.parentNode));
      if (jQuery.trim(textArea.val()) === '') {
        return textArea.val(this.model.sampleJSON);
      }
    }
  };

  return SignatureView;

})(Backbone.View);

this["Handlebars"]["templates"]["response_content_type"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.produces : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda;

  return "  <option value=\""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\">"
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "</option>\n";
},"4":function(depth0,helpers,partials,data) {
    return "  <option value=\"application/json\">application/json</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<label for=\"responseContentType\"></label>\n<select name=\"responseContentType\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.produces : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "</select>\n";
},"useData":true});
var StatusCodeView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

StatusCodeView = (function(superClass) {
  extend(StatusCodeView, superClass);

  function StatusCodeView() {
    return StatusCodeView.__super__.constructor.apply(this, arguments);
  }

  StatusCodeView.prototype.initialize = function() {};

  StatusCodeView.prototype.render = function() {
    var responseModel, responseModelView, template;
    template = this.template();
    jQuery(this.el).html(template(this.model));
    if (swaggerUi.api.models.hasOwnProperty(this.model.responseModel)) {
      responseModel = {
        sampleJSON: JSON.stringify(swaggerUi.api.models[this.model.responseModel].createJSONSample(), null, 2),
        isParam: false,
        signature: swaggerUi.api.models[this.model.responseModel].getMockSignature()
      };
      responseModelView = new SignatureView({
        model: responseModel,
        tagName: 'div'
      });
      jQuery('.model-signature', this.$el).append(responseModelView.render().el);
    } else {
      jQuery('.model-signature', this.$el).html('');
    }
    return this;
  };

  StatusCodeView.prototype.template = function() {
    return Handlebars.templates.status_code;
  };

  return StatusCodeView;

})(Backbone.View);

this["Handlebars"]["templates"]["signature"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "<div>\n<ul class=\"signature-nav\">\n  <li><a class=\"description-link\" href=\"#\">Model</a></li>\n  <li><a class=\"snippet-link\" href=\"#\">Model Schema</a></li>\n</ul>\n<div>\n\n<div class=\"signature-container\">\n  <div class=\"description\">\n    "
    + ((stack1 = ((helper = (helper = helpers.signature || (depth0 != null ? depth0.signature : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"signature","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n  </div>\n\n  <div class=\"snippet\">\n    <pre><code>"
    + this.escapeExpression(((helper = (helper = helpers.sampleJSON || (depth0 != null ? depth0.sampleJSON : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"sampleJSON","hash":{},"data":data}) : helper)))
    + "</code></pre>\n    <small class=\"notice\"></small>\n  </div>\n</div>\n\n";
},"useData":true});
this["Handlebars"]["templates"]["status_code"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "<td width='15%' class='code'>"
    + this.escapeExpression(((helper = (helper = helpers.code || (depth0 != null ? depth0.code : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"code","hash":{},"data":data}) : helper)))
    + "</td>\n<td>"
    + ((stack1 = ((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"message","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</td>\n<td width='50%'><span class=\"model-signature\" /></td>";
},"useData":true});