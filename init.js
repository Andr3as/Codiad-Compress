/*
* Copyright (c) Codiad & Andr3as, distributed
* as-is and without warranty under the MIT License.
* See [root]/license.md for more information. This information must remain intact.
*/

(function(global, $){

    //var codiad  = global.codiad,
    var scripts = document.getElementsByTagName('script'),
        path    = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/';

    $(function() {    
        codiad.Compress.init();
    });

    codiad.Compress = {
        
        path    : curpath,
        file    : "",
        settings: false,
        
        init: function() {
            $.getScript(this.path+"UglifyJS/uglifyjs.js");
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Show Dialog to use CSSTidy
        //
		//  Parameters:
		//
		//  path - {String} - File path
		//
		//////////////////////////////////////////////////////////
        showDialog: function(path) {
            this.file = path;
            var ext = this.getExtension(path);
            if (ext == "css") {
                codiad.modal.load(300, this.path+"dialog.php");
            } else if (ext == "js") {
                this.uglify(path);
            }
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Use CSSTidy to compress the file
        //
		//////////////////////////////////////////////////////////
        tidy: function() {
            var color, fontw, bslash, last, compression;
            compression = $('#compression').val();
            color       = $('#compress_colors').val();
            fontw       = $('#compress_font-weight').val();
            bslash      = $('#remove_bslash').val();
            last        = $('#remove_last').val();
            codiad.modal.unload();
            $.post(this.path+"controller.php?action=compressCSS&path="+this.file,
                {"compression": compression,"advanced": this.settings,"color": color, "fontw":fontw, "bslash": bslash, "last": last},
                function(data){
                    data = JSON.parse(data);
                    if (data.status == "error") {
                        codiad.message.error(data.message);
                    } else {
                        codiad.message.success(data.message);
                        codiad.filemanager.rescan(codiad.project.getCurrent());
                    }
            });
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Use UglifyJS to compress file
        //
        //////////////////////////////////////////////////////////
        uglify: function(path) {
            var _this = this;
            $.get(this.path+"controller.php?action=getContent&path="+path, function(code){
                var ast = UglifyJS.parse(code);
                ast.figure_out_scope();
                ast.compute_char_frequency();
                ast.mangle_names();
                code = ast.print_to_string();
                $.post(_this.path+"controller.php?action=compressJS&path="+path, {"code": code}, function(data){
                    data = JSON.parse(data);
                    if (data.status == "error") {
                        codiad.message.error(data.message);
                    } else {
                        codiad.message.success(data.message);
                        codiad.filemanager.rescan(codiad.project.getCurrent());
                    }
                });
            });
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Show or hide advanced settings
        //
        //////////////////////////////////////////////////////////
        showSettings: function() {
            if (!this.settings) {
                //Show advanced settings
                this.settings = true;
                $('#compress_settings').show();
                $('#icon_settings').removeClass();
                $('#icon_settings').addClass('icon-down-open-big');
            } else {
                //Hide settings
                this.settings = false;
                $('#compress_settings').hide();
                $('#icon_settings').removeClass();
                $('#icon_settings').addClass('icon-right-open-big');
            }
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Get extension of the given file
        //
        //  Parameters:
		//
		//  path - {String} - File path
		//
		//////////////////////////////////////////////////////////
        getExtension: function(path) {
            return path.substring(path.lastIndexOf(".")+1);
        }
    };

})(this, jQuery);