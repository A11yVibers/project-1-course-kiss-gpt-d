import React from 'react'

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    }
    return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
  })
}

function isTableDivider(line) {
  return /^\s*\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?\s*$/.test(line)
}

function tableCells(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim())
}

/** Renders the supplied course Markdown as safe React elements. */
export default function MarkdownDocument({ source }) {
  const lines = source.trim().split('\n')
  const blocks = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()

    if (!line) {
      index += 1
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      const Heading = `h${heading[1].length}`
      blocks.push(<Heading key={`heading-${index}`}>{renderInline(heading[2])}</Heading>)
      index += 1
      continue
    }

    if (lines[index + 1] && isTableDivider(lines[index + 1])) {
      const headers = tableCells(lines[index])
      const body = []
      index += 2
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        body.push(tableCells(lines[index]))
        index += 1
      }
      blocks.push(
        <div className="markdown-table-wrap" key={`table-${index}`}>
          <table>
            <thead><tr>{headers.map((header) => <th key={header}>{renderInline(header)}</th>)}</tr></thead>
            <tbody>{body.map((row, rowIndex) => <tr key={`row-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`cell-${cellIndex}`}>{renderInline(cell)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      )
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = []
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''))
        index += 1
      }
      blocks.push(<ol key={`list-${index}`}>{items.map((item) => <li key={item}>{renderInline(item)}</li>)}</ol>)
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items = []
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''))
        index += 1
      }
      blocks.push(<ul key={`list-${index}`}>{items.map((item) => <li key={item}>{renderInline(item)}</li>)}</ul>)
      continue
    }

    const paragraph = [line]
    index += 1
    while (index < lines.length && lines[index].trim() && !/^(#{1,3})\s+/.test(lines[index].trim()) && !/^\d+\.\s+/.test(lines[index].trim()) && !/^[-*]\s+/.test(lines[index].trim())) {
      if (lines[index + 1] && isTableDivider(lines[index + 1])) break
      paragraph.push(lines[index].trim())
      index += 1
    }
    blocks.push(<p key={`paragraph-${index}`}>{renderInline(paragraph.join(' '))}</p>)
  }

  return <article className="markdown-document">{blocks}</article>
}
