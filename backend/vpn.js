

class IntervalNode {
  constructor(interval) {
    this.interval = interval; 
    this.max = interval.end;
    this.left = null;
    this.right = null;
  }
}

class IntervalTree {
  constructor() {
    this.root = null;
  }
  
  insert(interval) {
    if (!this.root) {
      this.root = new IntervalNode(interval);
      return;
    }

    let node = this.root;
    while (true) {
      node.max = Math.max(node.max, interval.end);

      if (interval.start < node.interval.start) {
        if (!node.left) {
          node.left = new IntervalNode(interval);
          break;
        }
        node = node.left;
      } else {
        if (!node.right) {
          node.right = new IntervalNode(interval);
          break;
        }
        node = node.right;
      }
    }
  }

  query(point) {
    let node = this.root;
    while (node) {
      if (point >= node.interval.start && point <= node.interval.end) {
        return true;
      }

      if (node.left && point <= node.left.max) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return false;
  }
}

let itree;

async function updateList() {
  let timeoutMs = 20000;
  const ipv4CidrRanges = await fetch("https://raw.githubusercontent.com/josephrocca/is-vpn/main/vpn-or-datacenter-ipv4-ranges.txt", {signal:AbortSignal.timeout(timeoutMs)}).then(r => r.text()).then(t => t.trim().split("\n"));
  itree = new IntervalTree();
  ipv4CidrRanges.map(ipv4CidrToRange).forEach(range => itree.insert(range));
}

async function initialize() {
  await updateList();
  setInterval(updateList, 1000*60*60*12); 
}

initialize();

function ipToBinary(ip) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
}

function ipv4CidrToRange(cidr) {
  const [baseIp, subnetMask] = cidr.split('/');
  const ipBinary = ipToBinary(baseIp);
  const rangeStart = ipBinary;
  const rangeEnd = ipBinary | ((1 << (32 - subnetMask)) - 1);
  return {start:rangeStart, end:rangeEnd};
}

function isVpn(ip) {
  // Check if itree is initialized before querying
  if (!itree) {
    throw new Error('Interval tree is not initialized. Call initialize() first.');
  }

  const ipBinary = ipToBinary(ip);
  return itree.query(ipBinary);
}
module.exports = {
  isVpn,
  initialize 
};
