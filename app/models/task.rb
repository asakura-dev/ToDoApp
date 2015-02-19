class Task < ActiveRecord::Base
  belongs_to :user
  validates :title, presence: true, length: {maximum: 48}
  validates :description, length: {maximum: 1024}
  validates :status, inclusion: {in: 0..2 }
  # :non_processing, :prosessing, :done
  
end
