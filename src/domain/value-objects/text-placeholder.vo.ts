export interface TextPlaceholder {
  key: string // 'reborn_name', 'birth_date', etc.
  x: number // Posição X (pixels)
  y: number // Posição Y (pixels)
  fontSize: number // Tamanho da fonte
  fontFamily: string // 'Arial', 'Times New Roman', etc.
  color: string // '#000000'
  maxWidth?: number // Largura máxima
  textAlign?: 'left' | 'center' | 'right'
} 