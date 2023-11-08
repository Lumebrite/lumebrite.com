// helpers.js

// Create breadcrumb based off slug (file-path) and save the last 2 crumbs
function buildBreadcrumb(slug) {
	let breadcrumb = slug.split('/');
	if (breadcrumb.length > 2) {
		breadcrumb = breadcrumb.slice(-2);
	}
	const prettyBreadcrumb = breadcrumb.map((crumb) =>
		crumb
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' '),
	);
	return prettyBreadcrumb;
}

function buildCollection(slug) {
	// Pull out and format category name based on file-system path
	const category = slug
		.split('/')[1]
		.replace(/[-_]/g, ' ')
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	return category;
}

function buildCategory(slug) {
	// Pull out and format category name based on file-system path
	const category = slug
		.split('/')[2]
		.replace(/[-_]/g, ' ')
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	return category;
}

function buildNestedNav(arr) {
	let root = []; // Initialize the root of the transformed array

	// Iterate over each item in the sample array
	arr.forEach((item) => {
		// Split the URL into segments, and remove any empty segments
		let paths = item.url.split('/').filter(Boolean);

		// Start from the root for each item
		let node = root;

		// Traverse through each segment of the URL
		paths.forEach((path, index, array) => {
			// If we're at the last segment of the URL, we treat it differently
			if (index === array.length - 1) {
				node.push(item);
				return;
			}

			// Check if the current path/segment already exists at the current level
			let existingNode = node.find((n) => n.folder === path);

			// If it doesn't exist, we create a new node
			if (!existingNode) {
				const newNode = {
					folder: path,
					content: [],
				};
				// Add the newly created node to the current level
				node.push(newNode);
				// Move our pointer to the content (next level down the hierarchy)
				node = newNode.content;
			} else {
				// If the node already exists, move our pointer to its contents for the next segment
				if (!existingNode.content) {
					existingNode.content = [];
				}
				node = existingNode.content;
			}
		});
	});

	// Recursive function to sort nodes based on their weight
	const sortNode = (node) => {
		if (!node) return;

		if (Array.isArray(node)) {
			// Sort the nodes based on whether they are leaf or non-leaf nodes.
			// Non-leaf nodes come first, followed by leaf nodes sorted by weight.
			node.sort((a, b) => {
				if (a.title && b.title) {
					// If both are leaf nodes, sort by weight
					return a.weight - b.weight;
				} else if (a.title) {
					// If only 'a' is a leaf node, it comes after 'b'
					return 1;
				} else if (b.title) {
					// If only 'b' is a leaf node, it comes after 'a'
					return -1;
				} else {
					// If neither are leaf nodes, don't change the order
					return 0;
				}
			});

			node.forEach(sortNode); // Continue sorting the children
		} else if (node.content) {
			// If we have a content property, sort it
			sortNode(node.content);
		}
	};

	// Sort all nodes starting from the root
	sortNode(root);

	return root;
}

function applyOverrides(data, overrides) {
	const overrideMap = new Map();

	// Populate the overrideMap for quick access
	overrides.forEach((override) => {
		if (override.folder) {
			overrideMap.set(override.folder[0], {
				name: override.folder[1],
				content: override.content,
			});
		}
		if (override.content) {
			override.content.forEach((content) => {
				overrideMap.set(content.folder[0], {
					name: content.folder[1],
				});
			});
		}
	});

	function processNode(node) {
		const override = overrideMap.get(node.folder);

		// If this node has an override, apply the changes
		if (override) {
			// Rename the node to the override name
			node.folder = override.name;

			if (node.content && override.content) {
				// Reorder contents based on the override
				node.content.sort((a, b) => {
					const orderA = override.content.findIndex((ov) => ov.folder[0] === a.folder);
					const orderB = override.content.findIndex((ov) => ov.folder[0] === b.folder);

					// Handle nodes that might not be in the override list
					if (orderA === -1) return 1;
					if (orderB === -1) return -1;

					return orderA - orderB;
				});

				// Recursively process the contents
				node.content.forEach(processNode);
			}
		} else if (node.content) {
			// If there's no override for this node but it has contents, process them recursively
			node.content.forEach(processNode);
		}
	}

	// Start processing the data
	data.forEach(processNode);

	return data;
}

// Export the functions as properties of an object
const helper = {
	buildBreadcrumb,
	buildCollection,
	buildCategory,
	buildNestedNav,
	applyOverrides,
};

// Export the object for use in other files
export default helper;
