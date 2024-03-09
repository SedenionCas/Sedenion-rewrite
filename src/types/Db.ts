/* eslint-disable @typescript-eslint/naming-convention */
type DocumentId = string;
type RevisionId = string;
type Availability = "available" | "compacted" | "not compacted" | "missing";
type AttachmentData = string | Blob | Buffer;

interface IdMeta {
  _id: DocumentId;
}

interface RevisionInfo {
  rev: RevisionId;
  status: Availability;
}

/**
 * Stub attachments are returned by PouchDB by default (attachments option set to false)
 */
interface StubAttachment {
  /**
   * Mime type of the attachment
   */
  content_type: string;

  /**
   * Database digest of the attachment
   */
  digest: string;

  /**
   * Attachment is a stub
   */
  stub: true;

  /**
   * Length of the attachment
   */
  length: number;
}

/**
 * Full attachments are used to create new attachments or returned when the attachments option
 * is true.
 */
interface FullAttachment {
  /**
   * Mime type of the attachment
   */
  content_type: string;

  /** MD5 hash, starts with "md5-" prefix; populated by PouchDB for new attachments */
  digest?: string | undefined;

  /**
   * {string} if `binary` was `false`
   * {Blob|Buffer} if `binary` was `true`
   */
  data: AttachmentData;
}

type Attachment = StubAttachment | FullAttachment;

interface Attachments {
  [attachmentId: string]: Attachment;
}

interface GetMeta {
  /**
   * Conflicting leaf revisions.
   *
   * Only present if `GetOptions.conflicts` is `true`
   */
  _conflicts?: RevisionId[] | undefined;
  _rev: RevisionId;
  /** Only present if `GetOptions.revs` is `true` */
  _revs_info?: RevisionInfo[] | undefined;
  /** Only present if `GetOptions.revs_info` is `true` */
  _revisions?:
    | {
        ids: RevisionId[];
        start: number;
      }
    | undefined;

  /** Attachments where index is attachmentId */
  _attachments?: Attachments | undefined;
}

type Document<Content extends {}> = Content & IdMeta;

export type DbValue<Model extends {}> = Document<{ data: Model }> & GetMeta;
