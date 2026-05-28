import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // اجعلها false لضمان الحصول على أحدث البيانات فوراً
  useCdn: false, 
})