import dagre from 'dagre'
import { FC, useCallback, useMemo, useState } from 'react'
import ReactFlow, { Edge, Node, Position } from 'react-flow-renderer'

import Loader from '../../../common/components/Loader'
import { GenreApiOutput } from '../../../common/model'
import useGenreTreeQuery, { GenreTree } from '../hooks/useGenreTreeQuery'

const nodeWidth = 200
const nodeHeight = 50

type MyNode = Node<{ label: string; genre: GenreApiOutput }>

type MyEdge = Edge<ParentEdgeData | InfluenceEdgeData>
type ParentEdgeData = { type: 'parent' }
type InfluenceEdgeData = { type: 'influence' }

const getLayoutedElements = (
  nodes: Node[],
  edges: MyEdge[],
  direction = 'TB'
) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

  for (const node of nodes) {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  }

  for (const edge of edges.filter((edge) => edge.data?.type !== 'influence')) {
    dagreGraph.setEdge(edge.source, edge.target)
  }

  dagre.layout(dagreGraph)

  const outputNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    }
  })

  return { nodes: outputNodes, edges }
}

const TreeView: FC = () => {
  const { data: tree } = useGenreTreeQuery()

  if (!tree) {
    return <Loader size={32} className='text-stone-600' />
  }

  return <Loaded tree={tree} />
}

const Loaded: FC<{ tree: GenreTree }> = ({ tree }) => {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const toggleNode = useCallback(
    (id: number) =>
      setExpanded((exp) => {
        const newExp = new Set(exp)
        if (exp.has(id)) {
          newExp.delete(id)
        } else {
          newExp.add(id)
        }
        return newExp
      }),
    []
  )

  const genres = useMemo(() => Object.values(tree), [tree])

  const topLevelGenres = useMemo(
    () => genres.filter((genre) => genre.parents.length === 0),
    [genres]
  )

  const shownIds = useMemo(() => {
    const topLevelIds = topLevelGenres.map((genre) => genre.id)

    const shown = new Set<number>(topLevelIds)

    const queue = topLevelIds
    while (queue.length > 0) {
      const id = queue.pop()
      if (id === undefined) continue

      if (!expanded.has(id)) continue

      const genre = tree[id]
      for (const childId of genre.children) {
        shown.add(childId)
        queue.push(childId)
      }
    }

    return shown
  }, [expanded, topLevelGenres, tree])

  const initialNodes: MyNode[] = useMemo(
    () =>
      genres
        .filter((genre) => shownIds.has(genre.id))
        .map((genre) => ({
          id: genre.id.toString(),
          position: { x: 0, y: 0 },
          data: { label: genre.name, genre },
        })),
    [genres, shownIds]
  )
  const initialEdges: MyEdge[] = useMemo(
    () =>
      genres.flatMap((genre) => [
        ...genre.parents.map(
          (parentId): MyEdge => ({
            id: `par-${parentId}>${genre.id}`,
            source: parentId.toString(),
            target: genre.id.toString(),
            type: 'step',
            style: { stroke: 'blue' },
            data: { type: 'parent' },
          })
        ),
        // ...genre.influencedBy.map(
        //   (inf): MyEdge => ({
        //     id: `inf-${inf.id}>${genre.id}-${inf.influenceType ?? 'std'}`,
        //     source: inf.id.toString(),
        //     target: genre.id.toString(),
        //     type: 'step',
        //     style: { stroke: 'red' },
        //     data: { type: 'influence' },
        //   })
        // ),
      ]),
    [genres]
  )
  const { nodes, edges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges, 'LR'),
    [initialEdges, initialNodes]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      nodesConnectable={false}
      onNodeClick={(e, node: MyNode) => toggleNode(node.data.genre.id)}
    />
  )
}

export default TreeView
