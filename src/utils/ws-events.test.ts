import { assert, describe, test } from 'vitest';
import { extractJsonAndEventId } from './ws-events';

describe('extractJsonAndInteger function', () => {
  test('Returns the correct input', () => {
    const inputString =
      '1 A {"results":[{"isin":"US55354G1004","name":"MSCI Inc A","tags":[{"type":"index","id":"sp500","name":"SP500"},{"type":"sector","id":"services","name":"Dienstleistungen Diverse"},{"type":"attribute","id":"savable","name":"Sparplan"}],"type":"instrument","derivativeProductCategories":["vanillaWarrant","factorCertificate","knockOutProduct"],"imageId":"logos/US55354G1004/v2"},{"isin":"US5535301064","name":"MSC Industrial Direct","tags":[{"type":"sector","id":"machinery","name":"Maschinen & Apparate"},{"type":"attribute","id":"savable","name":"Sparplan"}],"type":"instrument","derivativeProductCategories":[],"imageId":"logos/US5535301064/v2"}],"resultCount":2,"correlationId":"d0b415c0-6623-4763-8e94-60cf312a04cb"}';
    const expectedEventId = 1;
    const expectedJson = {
      'results': [
        {
          'isin': 'US55354G1004',
          'name': 'MSCI Inc A',
          'tags': [
            {
              'type': 'index',
              'id': 'sp500',
              'name': 'SP500',
            },
            {
              'type': 'sector',
              'id': 'services',
              'name': 'Dienstleistungen Diverse',
            },
            {
              'type': 'attribute',
              'id': 'savable',
              'name': 'Sparplan',
            },
          ],
          'type': 'instrument',
          'derivativeProductCategories': [
            'vanillaWarrant',
            'factorCertificate',
            'knockOutProduct',
          ],
          'imageId': 'logos/US55354G1004/v2',
        },
        {
          'isin': 'US5535301064',
          'name': 'MSC Industrial Direct',
          'tags': [
            {
              'type': 'sector',
              'id': 'machinery',
              'name': 'Maschinen & Apparate',
            },
            {
              'type': 'attribute',
              'id': 'savable',
              'name': 'Sparplan',
            },
          ],
          'type': 'instrument',
          'derivativeProductCategories': [],
          'imageId': 'logos/US5535301064/v2',
        },
      ],
      'resultCount': 2,
      'correlationId': 'd0b415c0-6623-4763-8e94-60cf312a04cb',
    };

    const { eventId, jsonObject } = extractJsonAndEventId(inputString)!;

    assert.equal(
      eventId,
      expectedEventId,
      'Should extract the correct event ID.',
    );
    assert.deepEqual(
      jsonObject,
      expectedJson,
      'Should extract the correct JSON object',
    );
  });

  test('Returns null for invalid inputs', () => {
    const invalidInputString = 'Invalid Input';
    const resultForInvalidInput = extractJsonAndEventId(invalidInputString);

    assert.equal(
      resultForInvalidInput,
      null,
      'Should return null for invalid input',
    );
  });
});
