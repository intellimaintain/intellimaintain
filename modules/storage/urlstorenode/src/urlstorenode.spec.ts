import { NamedUrl, parseNamedUrl } from "@intellimaintain/url";
import { namedUrlToPath, nameSpaceDetails, OrganisationToNameSpaceToDetails } from "./urlstorenode";
import { ns1, org1, orgToDetails } from "./integration.fixture";


describe ( "nameSpaceDetails", () => {
  const mockParser = ( id: string, s: string ) => {};

  // Test that required fields must be provided and default values are used
  it ( 'fills in default values for optional properties if they are not provided', () => {
    const name = 'testName';
    const result = nameSpaceDetails ( name, { parser: mockParser } );

    expect ( result ).toEqual ( {
      pathInGitRepo: name, // Default to the name provided
      extension: 'yaml', // Default value
      mimeType: 'text/yaml', // Default value
      parser: mockParser, // Provided parser
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
      parser: mockParser,
      encoding: 'utf16le'
    } );

    expect ( result ).toEqual ( {
      pathInGitRepo: 'custom/path',
      extension: 'json',
      mimeType: 'application/json',
      parser: mockParser,
      encoding: 'utf16le'
    } );
  } );
} )

describe ( 'namedUrlToPath', () => {
  const mockOrgToDetails: OrganisationToNameSpaceToDetails = orgToDetails ( '/repo' );


  it ( 'returns the correct path for a valid NamedUrl', () => {
    const namedUrl: NamedUrl = parseNamedUrl ( 'itsm:org1:ns1:file1' )
    const result = namedUrlToPath ( mockOrgToDetails ) ( namedUrl );
    expect ( result ).toEqual ( {
      "details": ns1,
      "orgDetails": org1,
      "path": "/repo/org1Repo/ns1/file1.txt"
    } );
  } );

  // Test for an unknown organisation
  it ( 'returns an error for an unknown organisation', () => {
    const namedUrl: NamedUrl = parseNamedUrl ( 'itsm:1unknownOrg:space1:file1' )
    const result = namedUrlToPath ( mockOrgToDetails ) ( namedUrl );
    expect ( result ).toEqual ( [ "Don't know how to handle organisation 1unknownOrg. Legal organisations are org1" ] );
  } );

  // Test for an unknown namespace
  it ( 'returns an error for an unknown namespace', () => {
    const namedUrl: NamedUrl = parseNamedUrl ( 'itsm:org1:unknownSpace:file1' );
    const result = namedUrlToPath ( mockOrgToDetails ) ( namedUrl );
    expect ( result ).toEqual ( [ "Don't know how to handle namespace unknownSpace. Legal namespaces are ns1" ] );
  } );
} );