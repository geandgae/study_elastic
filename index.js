const { Client } = require('@elastic/elasticsearch');

// Elasticsearch 클라이언트 설정
const client = new Client({ node: 'http://localhost:9200' });

const indexName = 'my-index';

// Elasticsearch CRUD 함수 정의
const elasticsearchApp = {
  // 1. 데이터 생성
  async createDocument(id, document) {
    try {
      const response = await client.index({
        index: indexName,
        id: id,
        document: document,
      });
      console.log('Document created:', response);
    } catch (error) {
      console.error('Error creating document:', error);
    }
  },

  // 2. 데이터 읽기
  async getDocument(id) {
    try {
      const response = await client.get({
        index: indexName,
        id: id,
      });
      console.log('Document retrieved:', response._source);
    } catch (error) {
      console.error('Error retrieving document:', error);
    }
  },

  // 3. 데이터 업데이트
  async updateDocument(id, updatedFields) {
    try {
      const response = await client.update({
        index: indexName,
        id: id,
        doc: updatedFields,
      });
      console.log('Document updated:', response);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  },

  // 4. 데이터 삭제
  async deleteDocument(id) {
    try {
      const response = await client.delete({
        index: indexName,
        id: id,
      });
      console.log('Document deleted:', response);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  },

  // 5. 검색
  async searchDocuments(query) {
    try {
      const response = await client.search({
        index: indexName,
        query: {
          match: { content: query },
        },
      });
      console.log('Search results:', response.hits.hits.map(hit => hit._source));
    } catch (error) {
      console.error('Error searching documents:', error);
    }
  },
};

// 테스트 실행
(async () => {
  // 1. 데이터 생성
  await elasticsearchApp.createDocument('1', {
    title: 'Node.js with Elasticsearch11',
    content: 'Elasticsearch is a powerful search engine.',
    tags: ['nodejs', 'elasticsearch', 'search'],
  });

  await elasticsearchApp.createDocument('2', {
    title: 'Introduction to Elasticsearch2',
    content: 'This is a basic introduction to Elasticsearch.',
    tags: ['elasticsearch', 'introduction', 'search'],
  });

  // 2. 데이터 읽기
  await elasticsearchApp.getDocument('1');

  // 3. 데이터 업데이트
  await elasticsearchApp.updateDocument('1', {
    content: 'Elasticsearch is a powerful distributed search engine.',
  });

  // 4. 데이터 삭제
  await elasticsearchApp.deleteDocument('2');

  // 5. 데이터 검색
  await elasticsearchApp.searchDocuments('search');
})();
