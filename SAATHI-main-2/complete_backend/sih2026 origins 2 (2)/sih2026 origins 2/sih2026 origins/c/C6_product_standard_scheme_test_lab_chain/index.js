/**
 * C6 — Product -> Standard -> Scheme -> Test -> Lab Chain
 * Tables: compliance_graph_nodes, compliance_graph_edges
 * Logic: Relational graph resolver connecting products to applicable IS standards,
 * schemes, required tests, and accredited laboratories.
 */

const { db } = require('../database');

class ProductComplianceChainResolver {
  async resolveChain(productArg) {
    let productName = '';
    if (typeof productArg === 'object' && productArg !== null) {
      productName = productArg.product || productArg.productName || productArg.product_name || '';
    } else {
      productName = productArg || 'cement';
    }

    const term = productName.toLowerCase();

    // Query graph nodes and edges
    const nodes = await db.getTable('compliance_graph_nodes');
    const edges = await db.getTable('compliance_graph_edges');

    // Find product node
    let prodNode = nodes.find(n => n.node_type === 'PRODUCT' && n.node_name.toLowerCase().includes(term));
    if (!prodNode) {
      prodNode = term.includes('bat') || term.includes('cell') || term.includes('elec')
        ? nodes.find(n => n.id === 'node_prod_bat')
        : nodes.find(n => n.id === 'node_prod_opc');
    }

    // Traverse outward from prodNode
    // Edge: PRODUCT -(GOVERNED_BY)-> STANDARD
    const stdEdges = edges.filter(e => e.source_node_id === prodNode.id && e.relationship_type === 'GOVERNED_BY');
    const standardNodes = stdEdges.map(e => nodes.find(n => n.id === e.target_node_id)).filter(Boolean);

    const standardIds = standardNodes.map(s => s.id);

    // Edge: STANDARD -(FALLS_UNDER)-> SCHEME
    const schemeEdges = edges.filter(e => standardIds.includes(e.source_node_id) && e.relationship_type === 'FALLS_UNDER');
    const schemeNodes = schemeEdges.map(e => nodes.find(n => n.id === e.target_node_id)).filter(Boolean);

    // Edge: STANDARD -(REQUIRES_TEST)-> TEST
    const testEdges = edges.filter(e => standardIds.includes(e.source_node_id) && e.relationship_type === 'REQUIRES_TEST');
    const testNodes = testEdges.map(e => nodes.find(n => n.id === e.target_node_id)).filter(Boolean);

    const testIds = testNodes.map(t => t.id);

    // Edge: TEST -(TESTED_AT)-> LAB
    const labEdges = edges.filter(e => testIds.includes(e.source_node_id) && e.relationship_type === 'TESTED_AT');
    const labNodes = labEdges.map(e => nodes.find(n => n.id === e.target_node_id)).filter(Boolean);

    // Deduplicate labs
    const uniqueLabs = Array.from(new Map(labNodes.map(l => [l.id, l])).values());

    return {
      query_product: productName,
      root_node: {
        id: prodNode.id,
        type: prodNode.node_type,
        name: prodNode.node_name,
        code: prodNode.node_code
      },
      chain: {
        product: prodNode.node_name,
        standards: standardNodes.map(s => ({ id: s.id, code: s.node_code, name: s.node_name })),
        schemes: schemeNodes.map(s => ({ id: s.id, code: s.node_code, name: s.node_name })),
        required_tests: testNodes.map(t => ({ id: t.id, code: t.node_code, name: t.node_name })),
        accredited_labs: uniqueLabs.map(l => ({ id: l.id, code: l.node_code, name: l.node_name }))
      },
      graph_summary: {
        total_nodes_traversed: 1 + standardNodes.length + schemeNodes.length + testNodes.length + uniqueLabs.length,
        total_edges_resolved: stdEdges.length + schemeEdges.length + testEdges.length + labEdges.length
      },
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { ProductComplianceChainResolver };