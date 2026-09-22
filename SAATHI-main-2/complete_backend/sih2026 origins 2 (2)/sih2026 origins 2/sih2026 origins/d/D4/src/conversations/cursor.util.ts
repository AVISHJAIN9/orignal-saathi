import to from 'await-to-js';

export interface ConversationCursor {

  updatedAt: Date;
  id: string;

}

// Opaque pagination cursor for GET /conversations
// Encodes cursor object to URL-safe base64 string
export function encodeCursor(
  cursorObjectPayload: ConversationCursor
): string {

  const serializedPayloadString = JSON.stringify(
    {
      u: cursorObjectPayload.updatedAt.toISOString(
      ),
      id: cursorObjectPayload.id
    }
  );

  return Buffer.from(
    serializedPayloadString,
    'utf8'
  ).toString(
    'base64url'
  );

}

// Decodes and validates a cursor string asynchronously using tuple promise handling
export async function decodeCursor(
  rawCursorString: string
): Promise<
  ConversationCursor
> {

  const [
    decodeJsonError,
    parsedPayloadObject
  ] = await to(
    Promise.resolve(
    ).then(
      (
      ): unknown => JSON.parse(
        Buffer.from(
          rawCursorString,
          'base64url'
        ).toString(
          'utf8'
        )
      )
    )
  );

  if (
    decodeJsonError
  ) {
    throw new Error(
      'Malformed cursor encoding'
    );
  }

  if (
    typeof parsedPayloadObject !== 'object' || parsedPayloadObject === null
  ) {
    throw new Error(
      'Malformed cursor payload'
    );
  }

  const typedPayloadRecord = parsedPayloadObject as Record<
    string,
    unknown
  >;

  const {
    u: rawUpdatedAtString,
    id: rawConversationId
  } = typedPayloadRecord;

  if (
    typeof rawUpdatedAtString !== 'string' ||
    typeof rawConversationId !== 'string' ||
    rawConversationId.length === 0
  ) {
    throw new Error(
      'Malformed cursor fields'
    );
  }

  const parsedUpdatedAtDate = new Date(
    rawUpdatedAtString
  );

  if (
    Number.isNaN(
      parsedUpdatedAtDate.getTime(
      )
    )
  ) {
    throw new Error(
      'Malformed cursor date'
    );
  }

  return {
    updatedAt: parsedUpdatedAtDate,
    id: rawConversationId
  };

}
