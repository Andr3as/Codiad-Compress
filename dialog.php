<!--
    Copyright (c) Codiad & Andr3as, distributed
    as-is and without warranty under the MIT License. 
    See [root]/license.md for more information. This information must remain intact.
-->
<form id="compress_form">
    <label for="compression">Compression</label>
    <select name="compression" id="compression">
        <option value="highest_compression">Highest (no readability, smallest size)</option>
        <option value="high_compression">High (moderate readability, smaller size)</option>
        <option value="standard_compression">Standard (balance between readability and size)</option>
        <option value="low_compression">Low (higher readability)</option>
    </select>
    <div onclick="codiad.Compress.showSettings();">
        <label onclick="codiad.Compress.showSettings();">
            <i id="icon_settings" class="icon-right-open-big" onclick="codiad.Compress.showSettings();"></i>
            Advanced settings
        </label>
    </div>
    <div id="compress_settings">
        <table>
            <tr>
                <td><label for="compress_colors">Compress colors</label></td>
                <td>
                    <select class="compress_switch" name="compress_colors" id="compress_colors">
                        <option value="true">On</option>
                        <option value="false">Off</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td><label for="compress_font-weight">Compress font-weight</label></td>
                <td>
                    <select class="compress_switch" name="compress_font-weight" id="compress_font-weight">
                        <option value="true">On</option>
                        <option value="false">Off</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td><label for="remove_bslash">Remove unnecessary backslashes</label></td>
                <td>
                    <select class="compress_switch" name="remove_bslash" id="remove_bslash">
                        <option value="true">On</option>
                        <option value="false" selected>Off</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td><label for="remove_last">Remove last semicolon</label></td>
                <td>
                    <select class="compress_switch" name="remove_last" id="remove_last">
                        <option value="true">On</option>
                        <option value="false" selected>Off</option>
                    </select>
                </td>
            </tr>
        </table>
    </div>
    <button onclick="codiad.Compress.tidy(); return false;">Compress</button>
    <button onclick="codiad.modal.unload(); return false;">Close</button>
    <script>
        console.log($('#compress_form').ready(function(){
            $('#compress_settings').hide();
        }));
    </script>
</form>