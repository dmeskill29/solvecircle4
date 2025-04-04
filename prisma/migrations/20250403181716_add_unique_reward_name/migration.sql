/*
 Warnings:
 
 - A unique constraint covering the columns `[name]` on the table `RewardItem` will be added. If there are existing duplicate values, this will fail.
 
 */
-- CreateIndex
CREATE UNIQUE INDEX "RewardItem_name_key" ON "RewardItem"("name");
-- Add unique constraint to RewardItem name
ALTER TABLE "RewardItem"
ADD CONSTRAINT "RewardItem_name_key" UNIQUE ("name");
-- Insert sample rewards
INSERT INTO "RewardItem" (
    "id",
    "name",
    "description",
    "pointsCost",
    "available"
  )
VALUES (
    gen_random_uuid(),
    'Coffee Break',
    'A free coffee from the office coffee machine',
    100,
    true
  ),
  (
    gen_random_uuid(),
    'Extra Break Time',
    '30 minutes of extra break time',
    200,
    true
  ),
  (
    gen_random_uuid(),
    'Work From Home Day',
    'One day of remote work',
    500,
    true
  ),
  (
    gen_random_uuid(),
    'Team Lunch',
    'Free lunch with your team',
    300,
    true
  ),
  (
    gen_random_uuid(),
    'Professional Development Course',
    'Access to an online course of your choice',
    1000,
    true
  ) ON CONFLICT (name) DO
UPDATE
SET description = EXCLUDED.description,
  pointsCost = EXCLUDED.pointsCost,
  available = EXCLUDED.available;