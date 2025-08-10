
/**
 * Minimal Notion export stub
 * - You need a Notion integration token & databaseId
 * - In production, move this to a server function to keep token safe
 */
export async function exportToNotion(token: string, databaseId: string, title: string, markdown: string) {
  const pagePayload = {
    parent: { database_id: databaseId },
    properties: {
      title: { title: [{ text: { content: title } }] }
    },
    children: [
      { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: markdown } }] } }
    ]
  };
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pagePayload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
