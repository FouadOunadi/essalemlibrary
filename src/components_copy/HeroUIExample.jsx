import { Button, Card, CardBody, CardHeader } from '@heroui/react';

export default function HeroUIExample() {
  return (
    <div className="p-6 space-y-4 bg-grayBg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">HeroUI Integration with Custom Colors</h2>
      
      <div className="flex gap-4 flex-wrap">
        <Button color="primary" variant="solid">
          Primary Button (#4B99E9)
        </Button>
        <Button color="primary" variant="bordered">
          Primary Bordered
        </Button>
        <Button color="primary" variant="flat">
          Primary Flat
        </Button>
        <Button color="secondary" variant="solid">
          Secondary Button
        </Button>
      </div>

      <Card className="max-w-md">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">Daily Mix</p>
          <small className="text-default-500">12 Tracks</small>
          <h4 className="font-bold text-large">Frontend Radio</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <p className="text-small text-default-500">
            This is an example card component from HeroUI library demonstrating successful integration.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}