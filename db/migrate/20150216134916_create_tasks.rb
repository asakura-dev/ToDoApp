class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.date :deadline
      t.string :title
      t.text :description
      t.integer :user_id
      t.integer :progress
      t.integer :status

      t.timestamps
    end
  end
end
