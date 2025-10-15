// content.js
// This script will eventually contain logic to convert dates/times to the user's local timezone.


// Regular expression to match common date and time formats
const dateRegex = new RegExp(
	[
		// e.g., October 14, 2025 at 7:59 PM EDT
		'(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+\\d{1,2},\\s+\\d{4}(?:\\s+at\\s+\\d{1,2}:\\d{2}(?:\\s*[AP]M)?(?:\\s*[A-Z]{2,4})?)?',
		// e.g., 2025-10-14T23:59:00Z
		'\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(?::\\d{2})?Z?',
		// e.g., 14/10/2025 19:59 or 14-10-2025 19:59
		'\\d{1,2}[\\/\\-]\\d{1,2}[\\/\\-]\\d{2,4}(?:\\s+\\d{1,2}:\\d{2})?'
	].join('|'),
	'gi'
);

function findAndReplaceDates() {
	function walk(node) {
		let child, next;
		switch (node.nodeType) {
			case 1: // Element
			case 9: // Document
			case 11: // Document fragment
				child = node.firstChild;
				while (child) {
					next = child.nextSibling;
					walk(child);
					child = next;
				}
				break;
			case 3: // Text node
				handleText(node);
				break;
		}
	}

	function handleText(textNode) {
		const { textContent } = textNode;
		if (!dateRegex.test(textContent)) return;
		// Reset regex lastIndex for global regex
		dateRegex.lastIndex = 0;
		const frag = document.createDocumentFragment();
		let lastIndex = 0;
		let match;
		while ((match = dateRegex.exec(textContent)) !== null) {
			// Add text before match
			if (match.index > lastIndex) {
				frag.appendChild(document.createTextNode(textContent.slice(lastIndex, match.index)));
			}
			// Create span for date
			const span = document.createElement('span');
			span.className = 'chrono-sync-date';
			span.textContent = match[0];
			span.setAttribute('data-original-date', match[0]);
			frag.appendChild(span);
			lastIndex = match.index + match[0].length;
		}
		// Add remaining text
		if (lastIndex < textContent.length) {
			frag.appendChild(document.createTextNode(textContent.slice(lastIndex)));
		}
		// Replace text node with fragment
		textNode.parentNode.replaceChild(frag, textNode);
	}

		walk(document.body);

		// Add mouseover event listeners to all chrono-sync-date spans
		document.querySelectorAll('.chrono-sync-date').forEach(span => {
			span.addEventListener('mouseenter', handleMouseEnter);
			span.addEventListener('mouseleave', handleMouseLeave);
		});
	}

	function convertToLocalTime(dateString) {
		// Try to parse the date string
		let date = Date.parse(dateString);
		if (isNaN(date)) {
			// Try with new Date constructor as fallback
			date = new Date(dateString);
			if (isNaN(date.getTime())) return 'Unrecognized date';
		} else {
			date = new Date(date);
		}
		// Format using Intl.DateTimeFormat
		const formatter = new Intl.DateTimeFormat(undefined, {
			year: 'numeric', month: 'long', day: 'numeric',
			hour: '2-digit', minute: '2-digit', second: '2-digit',
			timeZoneName: 'short'
		});
		return formatter.format(date);
	}

	let tooltip;
	function handleMouseEnter(e) {
		const span = e.currentTarget;
		const original = span.getAttribute('data-original-date');
		const localTime = convertToLocalTime(original);
			tooltip = document.createElement('div');
			tooltip.textContent = localTime;
			tooltip.className = 'chrono-sync-tooltip';
			document.body.appendChild(tooltip);
			const rect = span.getBoundingClientRect();
			tooltip.style.left = `${rect.left + window.scrollX}px`;
			tooltip.style.top = `${rect.bottom + window.scrollY + 4}px`;
	}

	function handleMouseLeave() {
		if (tooltip) {
			tooltip.remove();
			tooltip = null;
		}
	}

	window.addEventListener('DOMContentLoaded', findAndReplaceDates);
