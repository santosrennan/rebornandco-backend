import { DataSource } from 'typeorm'
import { DocumentTemplateEntity } from '../orm/document-template.entity'
import { BIRTH_CERTIFICATE_TEMPLATES } from '../data/birth-certificate-templates'
import { config } from '../../config/environment.config'

export async function seedTemplates() {
  const dataSource = new DataSource({
    type: config.database.type as 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    entities: [DocumentTemplateEntity],
    synchronize: false,
    logging: false,
  })

  try {
    await dataSource.initialize()
    console.log('🔌 Conectado ao banco de dados')

    const templateRepository = dataSource.getRepository(DocumentTemplateEntity)

    const existingCount = await templateRepository.count()
    if (existingCount > 0) {
      console.log('📋 Templates já existem no banco')
      return
    }

    console.log('🌱 Inserindo templates...')
    for (const template of BIRTH_CERTIFICATE_TEMPLATES) {
      const templateEntity = templateRepository.create({
        id: template.id,
        name: template.name,
        type: template.type,
        description: template.description,
        thumbnailUrl: template.thumbnailUrl,
        baseImageUrl: template.baseImageUrl,
        width: template.width,
        height: template.height,
        placeholders: template.placeholders,
        isActive: template.isActive,
        createdAt: template.createdAt,
      })

      await templateRepository.save(templateEntity)
      console.log(`✅ Template criado: ${template.name}`)
    }

    console.log('🎉 Templates inseridos com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao inserir templates:', error)
  } finally {
    await dataSource.destroy()
  }
}

if (require.main === module) {
  seedTemplates()
} 