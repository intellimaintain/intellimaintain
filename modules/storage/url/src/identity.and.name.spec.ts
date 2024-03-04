import { foldNamedOrIdentityUrl, IdentityUrl, NamedUrl, parseUrl } from "./identity.and.name.url";

describe ( 'parseUrl', () => {
  // Test for a valid NamedUrl
  it ( 'parses valid NamedUrl correctly', () => {
    const urlString = 'itsm:org1:space1:name1';
    const result = parseUrl ( urlString );
    expect ( result ).toEqual ( {
      scheme: 'itsm',
      organisation: 'org1',
      namespace: 'space1',
      name: 'name1',
    } );
  } );

  // Test for a valid IdentityUrl
  it ( 'parses valid IdentityUrl correctly', () => {
    const urlString = 'itsmid:org2:id:identifier1';
    const result = parseUrl ( urlString );
    expect ( result ).toEqual ( {
      scheme: 'itsmid',
      organisation: 'org2',
      namespace: 'id',
      id: 'identifier1',
    } );
  } );

  it ( 'returns an error for URLs with invalid scheme', () => {
    const urlString = 'invalid:org1:space1:name1';
    const result = parseUrl ( urlString );
    expect ( result ).toEqual ( [ `invalid:org1:space1:name1 is not a valid itsm url. It has the wrong scheme invalid. Legal values are 'itsm' and 'itsmid'` ] );
  } );

  it ( 'returns an error for URLs with insufficient parts', () => {
    const urlString = 'itsm:org1';
    const result = parseUrl ( urlString );
    expect ( result ).toEqual ( [ `itsm:org1 is not a valid itsm url. It only has 2 parts` ] );
  } );

  it ( 'returns an error for invalid characters in the organisation part', () => {
    const urlString = 'itsm:org*1:space1:name1';
    const result = parseUrl ( urlString );
    expect ( result ).toEqual ( [ `Part [1 (org*1) of ${urlString} contains invalid characters. Only a-z, A-Z, 0-9, and /_-. are allowed.` ] );
  } );

  it ( 'returns an error for invalid characters in the namespace part', () => {
    const urlString = 'itsm:org1:spa ce1:name1';
    const result = parseUrl ( urlString );
    expect ( result ).toEqual ( [ `Part [2 (spa ce1) of ${urlString} contains invalid characters. Only a-z, A-Z, 0-9, and /_-. are allowed.` ] );
  } );

  it ( 'returns an error for invalid characters in the name/id part', () => {
    const urlString = 'itsm:org1:space1:na$me1';
    const result = parseUrl ( urlString );
    expect ( result ).toEqual ( [ `Part [3 (na$me1) of ${urlString} contains invalid characters. Only a-z, A-Z, 0-9, and /_-. are allowed.` ] );
  } );

} );

describe ( "foldNamedOrIdentityUrl", () => {
  const namedFn = ( n: NamedUrl ) => `Named: ${n.scheme}-${n.organisation}-${n.namespace}-${n.name}`;
  const identityFn = ( i: IdentityUrl ) => `Identity: ${i.scheme}-${i.organisation}-${i.namespace}-${i.id}`;

  // Test for NamedUrl input
  it ( 'returns correct string for NamedUrl', () => {
    const namedUrl: NamedUrl = {
      url: 'itsm:org1:space1:name1',
      scheme: 'itsm',
      organisation: 'org1',
      namespace: 'space1',
      name: 'name1',
    };

    const result = foldNamedOrIdentityUrl ( namedFn, identityFn, namedUrl );
    expect ( result ).toBe ( `Named: itsm-org1-space1-name1` );
  } );

  // Test for IdentityUrl input
  it ( 'returns correct string for IdentityUrl', () => {
    const identityUrl: IdentityUrl = {
      url: 'itsmid:org2:id:identifier1',
      scheme: 'itsmid',
      organisation: 'org2',
      namespace: 'id',
      id: 'identifier1',
    };

    const result = foldNamedOrIdentityUrl ( namedFn, identityFn, identityUrl );
    expect ( result ).toBe ( `Identity: itsmid-org2-id-identifier1` );
  } );
} )
