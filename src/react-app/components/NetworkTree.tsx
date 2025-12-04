import { useState } from 'react';
import { ChevronDown, ChevronRight, Users as UsersIcon } from 'lucide-react';

interface Referral {
  id: number;
  level: number;
  full_name: string;
  email: string;
  plan: string;
  status: string;
  member_created_at: string;
}

interface TreeNode {
  referral: Referral;
  children: TreeNode[];
}

interface NetworkTreeProps {
  referrals: Referral[];
  onNodeClick: (referral: Referral) => void;
}

// Build tree structure from flat referrals array
function buildTree(referrals: Referral[]): TreeNode[] {
  const nodesByLevel: Map<number, TreeNode[]> = new Map();

  // Group referrals by level
  referrals.forEach(referral => {
    const node: TreeNode = { referral, children: [] };
    const level = referral.level;
    
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node);
  });

  // Build the tree structure
  const maxLevel = Math.max(...Array.from(nodesByLevel.keys()));
  
  for (let level = maxLevel; level > 1; level--) {
    const currentLevelNodes = nodesByLevel.get(level) || [];
    const parentLevelNodes = nodesByLevel.get(level - 1) || [];
    
    // For simplicity, we'll attach children evenly to parents
    // In a real scenario, you'd have a parent_id field to determine the exact relationship
    const childrenPerParent = Math.ceil(currentLevelNodes.length / Math.max(parentLevelNodes.length, 1));
    
    parentLevelNodes.forEach((parent, index) => {
      const startIdx = index * childrenPerParent;
      const endIdx = Math.min(startIdx + childrenPerParent, currentLevelNodes.length);
      parent.children = currentLevelNodes.slice(startIdx, endIdx);
    });
  }

  // Level 1 nodes are roots
  return nodesByLevel.get(1) || [];
}

function NetworkNode({ node, onNodeClick }: { node: TreeNode; onNodeClick: (referral: Referral) => void }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'assinante':
        return 'bg-blue-500';
      case 'associado':
        return 'bg-green-500';
      case 'embaixador':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusIndicator = (status: string) => {
    return status === 'active' 
      ? 'bg-green-400 border-2 border-white' 
      : 'bg-yellow-400 border-2 border-white';
  };

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <button
            onClick={() => onNodeClick(node.referral)}
            className={`w-16 h-16 rounded-full ${getPlanColor(node.referral.plan)} flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all cursor-pointer relative`}
          >
            {getInitials(node.referral.full_name)}
            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${getStatusIndicator(node.referral.status)}`}></div>
          </button>
        </div>
        <div className="mt-2 text-center">
          <div className="font-medium text-sm text-primary max-w-[120px] truncate">
            {node.referral.full_name}
          </div>
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-xs text-accent hover:text-primary transition-colors flex items-center gap-1 mx-auto"
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-3 h-3" />
                  Recolher
                </>
              ) : (
                <>
                  <ChevronRight className="w-3 h-3" />
                  Expandir ({node.children.length})
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gray-300 -translate-x-1/2"></div>
          
          {/* Horizontal connecting line */}
          {node.children.length > 1 && (
            <div 
              className="absolute top-8 h-0.5 bg-gray-300"
              style={{
                left: '25%',
                right: '25%',
              }}
            ></div>
          )}

          <div className="flex gap-8 pt-8">
            {node.children.map((child) => (
              <div key={child.referral.id} className="relative">
                {/* Vertical line to child */}
                <div className="absolute bottom-full left-1/2 w-0.5 h-8 bg-gray-300 -translate-x-1/2"></div>
                <NetworkNode node={child} onNodeClick={onNodeClick} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NetworkTree({ referrals, onNodeClick }: NetworkTreeProps) {
  if (referrals.length === 0) {
    return (
      <div className="text-center py-12">
        <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-text-light">Você ainda não tem uma rede de afiliados</p>
        <p className="text-sm text-gray-500 mt-2">Compartilhe seu link de indicação para começar a construir sua rede</p>
      </div>
    );
  }

  const tree = buildTree(referrals);

  return (
    <div className="overflow-x-auto pb-8">
      <div className="min-w-max px-8">
        <div className="flex justify-center gap-12">
          {tree.map(node => (
            <NetworkNode key={node.referral.id} node={node} onNodeClick={onNodeClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
