const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

// searchWithScore
async function searchWithScore() {
  const result = await client.search({
    index: 'my-index',
    query: {
      match: {
        content: 'Elasticsearch powerful search engine', // 검색어
      },
    },
  });
  console.log('Search Results with _score:');
  result.hits.hits.forEach((hit) => {
    console.log({
      _id: hit._id,
      _score: hit._score,
      content: hit._source.content,
    });
  });
}
searchWithScore();

// searchWithBoost
async function searchWithBoost() {
  const result = await client.search({
    index: 'my-index',
    query: {
      match: {
        title: {
          query: 'Elasticsearch',
          boost: 2.0, // 가중치 설정
        },
      },
    },
  });
  console.log('Search Results with Boosted _score:');
  result.hits.hits.forEach((hit) => {
    console.log({
      _id: hit._id,
      _score: hit._score,
      title: hit._source.title,
    });
  });
}
searchWithBoost();

// searchWithFunctionScore
async function searchWithFunctionScore() {
  const result = await client.search({
    index: 'my-index',
    query: {
      function_score: {
        query: {
          match: { content: 'Elasticsearch' },
        },
        functions: [
          {
            field_value_factor: {
              field: 'popularity', // popularity 필드 사용
              factor: 1.5,         // 가중치 배율
              modifier: 'sqrt',    // 점수 정규화
            },
          },
        ],
        boost_mode: 'sum', // 기본 점수와 가중치를 더함
      },
    },
  });
  console.log('Search Results with Function Score:');
  result.hits.hits.forEach((hit) => {
    console.log({
      _id: hit._id,
      _score: hit._score,
      content: hit._source.content,
      popularity: hit._source.popularity,
    });
  });
}
searchWithFunctionScore();

// searchWithScriptScore
async function searchWithScriptScore() {
  const result = await client.search({
    index: 'my-index',
    query: {
      script_score: {
        query: {
          match: { content: 'Elasticsearch' },
        },
        script: {
          source: '_score * doc["popularity"].value', // _score와 popularity 곱
        },
      },
    },
  });
  console.log('Search Results with Script Score:');
  result.hits.hits.forEach((hit) => {
    console.log({
      _id: hit._id,
      _score: hit._score,
      content: hit._source.content,
      popularity: hit._source.popularity,
    });
  });
}
searchWithScriptScore();

// searchAndSortByScore
async function searchAndSortByScore() {
  const result = await client.search({
    index: 'my-index',
    query: {
      match: { content: 'Elasticsearch' },
    },
    sort: [{ _score: 'desc' }], // _score 기준 내림차순 정렬
  });

  console.log('Search Results Sorted by _score:');
  result.hits.hits.forEach((hit) => {
    console.log({
      _id: hit._id,
      _score: hit._score,
      content: hit._source.content,
    });
  });
}
searchAndSortByScore();