// ==UserScript==
// @name         Iframe HTML Exporter
// @namespace    http://tampermonkey.net/
// @version      2026-03-29
// @description  Export iframe content as HTML file
// @author       yethranayeh
// @homepage     https://github.com/yethranayeh
// @match        <your_matcher>
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
	"use strict";

	function exportAsHTML(doc) {
		if (!doc) {
			alert("Could not access iframe content. Page may not be fully loaded");
			return;
		}

		const html = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
		const blob = new Blob([html], { type: "text/html" });
		const url = URL.createObjectURL(blob);

		const title = doc.title || "iframe-export";
		const filename = title.replace(/[^a-z0-9_\-\s]/gi, "_").trim() + ".html";

		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();

		setTimeout(() => URL.revokeObjectURL(url), 5000);
	}

	function injectButton(iframe) {
		if (iframe.dataset.exporterInjected) {
			return;
		}
		iframe.dataset.exporterInjected = "true";

		const btn = document.createElement("button");

		btn.textContent = "Download as HTML";
		btn.style.cursor = "pointer";
		btn.style.display = "block";
		btn.style.padding = "8px 14px";
		btn.style.background = "#fff";
		btn.style.border = "2px solid lime";
		btn.style.borderRadius = "8px";
		btn.style.position = "fixed";
		btn.style.top = "50px";
		btn.style.right = "12px";
		btn.style.zIndex = "999999";

		btn.addEventListener("click", () => exportAsHTML(iframe.contentDocument));
		iframe.insertAdjacentElement("afterend", btn);
	}

	function scanIframes() {
		// TODO: might need a better way to select specific iframes only
		document.querySelectorAll("iframe").forEach((iframe) => {
			try {
				const doc = iframe.contentDocument;
				if (doc && doc.body && doc.body.children.length > 0) injectButton(iframe);
			} catch (e) {}
		});
	}

	const observer = new MutationObserver(scanIframes);
	observer.observe(document.body, { childList: true, subtree: true });

	window.addEventListener("load", scanIframes);
})();
