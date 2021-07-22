use comrak::ComrakExtensionOptions;
use comrak::ComrakOptions;
use comrak::ComrakParseOptions;
use comrak::ComrakRenderOptions;
use js_sys::TypeError;
use serde::Deserialize;
use wasm_bindgen::prelude::*;

#[derive(Deserialize)]
struct FlatComrakOptions {
    extension_autolink: bool,
    extension_description_lists: bool,
    extension_footnotes: bool,
    extension_front_matter_delimiter: Option<String>,
    extension_header_ids: Option<String>,
    extension_strikethrough: bool,
    extension_superscript: bool,
    extension_table: bool,
    extension_tagfilter: bool,
    extension_tasklist: bool,
    parse_default_into_string: Option<String>,
    parse_smart: bool,
    render_escape: bool,
    render_github_pre_lang: bool,
    render_hardbreaks: bool,
    render_unsafe: bool,
    render_width: usize,
}

#[wasm_bindgen]
pub fn markdown_to_html(md: &str, opts: &JsValue) -> Result<String, JsValue> {
    let opts: FlatComrakOptions =
        JsValue::into_serde(&opts).map_err(|err| TypeError::new(&err.to_string()))?;
    let opts = ComrakOptions {
        extension: ComrakExtensionOptions {
            autolink: opts.extension_autolink,
            description_lists: opts.extension_description_lists,
            footnotes: opts.extension_footnotes,
            front_matter_delimiter: opts.extension_front_matter_delimiter,
            header_ids: opts.extension_header_ids,
            strikethrough: opts.extension_strikethrough,
            superscript: opts.extension_superscript,
            table: opts.extension_table,
            tagfilter: opts.extension_tagfilter,
            tasklist: opts.extension_tasklist,
        },
        parse: ComrakParseOptions {
            default_info_string: opts.parse_default_into_string,
            smart: opts.parse_smart,
        },
        render: ComrakRenderOptions {
            escape: opts.render_escape,
            github_pre_lang: opts.render_github_pre_lang,
            hardbreaks: opts.render_hardbreaks,
            unsafe_: opts.render_unsafe,
            width: opts.render_width,
        },
    };
    let html = comrak::markdown_to_html(md, &opts);
    Ok(html)
}
