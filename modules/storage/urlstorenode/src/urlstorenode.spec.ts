import { NamedUrl, namedUrlToPathAndDetails, nameSpaceDetails, OrganisationUrlStoreConfig, parseNamedUrl } from "@intellimaintain/url";
import { ns1,  orgToDetails } from "./integration.fixture";


describe ( "nameSpaceDetails", () => {
  const parser = ( id: string, s: string ) => {};
  const writer = ( s: string ) => s + "_written";

  // Test that required fields must be provided and default values are used
  it ( 'fills in default values for optional properties if they are not provided', () => {
    const name = 'testName';
    const result = nameSpaceDetails ( name, { parser, writer } );

    expect ( result ).toEqual ( {
      pathInGitRepo: name, // Default to the name provided
      extension: 'yaml', // Default value
      mimeType: 'text/yaml', // Default value
      parser,
      writer,
      encoding: 'utf8' // Default value
    } );
  } );

  // Test that provided values override defaults
  it ( 'uses provided values for properties over defaults', () => {
    const name = 'customName';
    const result = nameSpaceDetails ( name, {
      pathInGitRepo: 'custom/path',
      extension: 'json',
      mimeType: 'application/json',
      parser,
      writer,
      encoding: 'utf16le'
    } );

    expect ( result ).toEqual ( {
      pathInGitRepo: 'custom/path',
      extension: 'json',
      mimeType: 'application/json',
      parser,
      writer,
      encoding: 'utf16le'
    } );
  } );
} )

describe ( 'namedUrlToPath', () => {
  const mockOrgToDetails: OrganisationUrlStoreConfig = orgToDetails ( '/repo' );


  it ( 'returns the correct path for a valid NamedUrl', () => {
    const namedUrl: NamedUrl = parseNamedUrl ( 'itsm:org1:ns1:file1' )
    const result = namedUrlToPathAndDetails ( mockOrgToDetails ) ( namedUrl );
    expect ( result ).toEqual ( {
      "details": ns1,
      "path":  "/repo/org1/namespace/path/file1.txt",
    } );
  } );

  it ( 'returns an error for an unknown namespace', () => {
    const namedUrl: NamedUrl = parseNamedUrl ( 'itsm:org1:unknownSpace:file1' );
    const result = namedUrlToPathAndDetails ( mockOrgToDetails ) ( namedUrl );
    expect ( result ).toEqual ( [ "Don't know how to handle namespace unknownSpace. Legal namespaces are ns1" ] );
  } );
} );