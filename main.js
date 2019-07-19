function getDescendants(node, accum) {
  var i;
  accum = accum || [];
  for (i = 0; i < node.childNodes.length; i++) {
    accum.push(node.childNodes[i])
    getDescendants(node.childNodes[i], accum);
  }
  return accum;
}

function findToxicInArray(nodeList) {
  var toxicNode = undefined;

  Array.from(nodeList).some((n) => {
    var descendants = getDescendants(n);

    return descendants.some((internalNode) => {
      if (internalNode.tagName !== 'DIV' || !internalNode.innerHTML) {
        return false;
      }

      if (internalNode.innerHTML.slice(0, 40).includes('data-icon="forwarded"')) {
        console.log('achei mensagem encaminhada!');
        toxicNode = internalNode;
        return true;
      }

      return false;
    });
  });

  return toxicNode;
}

function cleanUpMain(node) {
  var toxicNode = findToxicInArray(node.childNodes);
  console.log('achado algo toxico na main')
  console.log(toxicNode);
  while (toxicNode) {
    console.log('achado algo toxico na main')
    console.log(toxicNode);
    //toxicNode.parentElement.removeChild(toxicNode);
    toxicNode = findToxicInArray(document.getElementById('main'));
  }
}

// callback executed when main is found
function handleMain(main) {

  // select the target node
  var target = main;

  // cleanUp main
  cleanUpMain(main);

  // create an observer instance
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var nodes = mutation.addedNodes;
      var node;

      for (var n = 0; node = nodes[n], n < nodes.length; n++) {
        if (node.childNodes.length > 0 && findToxicInArray(node.childNodes)) {
          console.log('Hiding forwarded message...');
          node.parentElement.removeChild(node);
        }
      };
    });
  });

  // configuration of the observer:
  var config = { attributes: false, childList: true, subtree: true, characterData: false };

  // pass in the target node, as well as the observer options
  observer.observe(target, config);
}

// set up the mutation observer
var observer = new MutationObserver(function (mutations, me) {
  // `mutations` is an array of mutations that occurred
  // `me` is the MutationObserver instance
  var main = document.getElementById('main');
  if (main) {
    handleMain(main);
    me.disconnect(); // stop observing
    return;
  }
});

// start observing
observer.observe(document, {
  childList: true,
  subtree: true
});