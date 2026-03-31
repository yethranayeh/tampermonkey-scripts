// ==UserScript==
// @name         Highlight ads
// @namespace    http://tampermonkey.net/
// @version      2026-02-14
// @description  makes ad posts as apparent as possible so they don't look like regular posts and waste your time
// @author       yethranayeh
// @homepage     https://github.com/yethranayeh
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// ==/UserScript==

(function () {
	"use strict";
	const handled = new Set();

	const TAG = "span";

	const getAdElements = () => Array.from(document.querySelectorAll(TAG)).filter((s) => s.textContent === "Ad");

	setInterval(() => {
		const elements = getAdElements();

		for (const el of elements) {
			if (handled.has(el)) {
				continue;
			}

			el.style.outline = "1px solid lime";
			let container = null;
			let tries = 12;

			while (tries > 0) {
				tries -= 1;
				const parent = container?.parentElement ?? el.parentElement;
				container = parent;
				if (parent.tagName.toLowerCase() === "article") {
					break;
				}
			}

			if (container != null) {
				container.style.backgroundColor = "red";
			}
			handled.add(el);
		}
	}, 1000);
})();
